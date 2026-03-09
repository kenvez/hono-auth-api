import 'dotenv/config'
import bcrypt from 'bcrypt';
import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { jwt, sign } from 'hono/jwt';
import type { JwtVariables } from 'hono/jwt';

import client, { connectDB, createTables } from './db.js';

type Variables = JwtVariables;

const app = new Hono<{ Variables: Variables }>();

await connectDB();
await createTables();

app.use(
  '/auth/*',
  jwt({
    secret: process.env.JWT_SECRET!,
    alg: 'HS256',
  })
);

app.get('/', (c) => c.text('Hono!'));
app.get('/auth/page', c => {
  const payload = c.get('jwtPayload')
  return c.json(payload)
});

app.post('/register', async (c) => {
  try {
    const { username, password } = await c.req.json();
    
    if (!username || !password) {
      return c.json({ message: 'Username and password are required' }, 400)
    }
    
    const result = await client.query('select * from users where username = $1', [username]);
    const user = result.rows[0];

    if (user) {
      return c.json({ message: 'User with this username already exists.', username }, 409);
    } else {
      const saltRounds = 10;
      const hash = await bcrypt.hash(password, saltRounds)

      await client.query(
        'insert into users (username, password) values ($1, $2)',
        [username, hash]
      )

      return c.json({ message: 'User registered', username });
    }
  } catch (error) {
    return c.json({ message: 'Internal server error' }, 500);
  }
})

app.post('/login', async (c) => {
  try {
    const { username, password } = await c.req.json();

    if (!username || !password) {
      return c.json({ message: 'Username and password are required' }, 400)
    }

    const result = await client.query('select * from users where username = $1', [username]);
    const user = result.rows[0];

    if (user) {
      const compare = await bcrypt.compare(password, user.password);

      if (compare) {
        const token = await sign({ username: user.username }, process.env.JWT_SECRET!);

        return c.json({ message: 'User logged in', token: token }, 200);
      } else {
        return  c.json({ message: 'Incorrect password.' }, 400);
      }
    } else {
      return c.json({ message: 'User with this username does not exist.'}, 400);
    }
  } catch (error) {
    return c.json({ message: 'Internal sever error'}, 500);
  }
})

serve({
  fetch: app.fetch,
  port: 8080
});