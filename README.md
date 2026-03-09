# Hono Auth API

## What is this project?
A REST API for authentication written using typescript and hono, using best practices such as:
- hashing password using bcrypt library
- using environment variables, to prevent hard coding secure credentials
- clean code and architecture

## What technologies did I use and why?
- Hono, it's a lightweight and fast web framework, I've used it because the developer experience is good and docs are great.
- TypeScript, I've used it to learn about more of the typescript ecosystem, and have types.
- bcrypt, I've used it because it's the easiest and most secure way to store hashed passwords in the database.

## How to run it locally
1. Clone the repo
2. Create a `.env` file with:
   - **DATABASE_URL**=your-neon-connection-string
   - **JWT_SECRET**=your-secret
3. Run `npm install`
4. Run `npm run dev`
5. Go to `localhost:8080`

## What endpoints exist?
**GET**
- `/` - it returns a message `Hono!`
- `/auth/page` - you can access this endpoint only when you are authorized (e.g. you can authorize with the bearer token which is generated when you have logged in successfully)

**POST**
- `/register` - you can register via this endpoint in the payload you need to provide username and password otherwise you will get an error
- `/login` - after registering successfully, you can login with your credentials in the payload, in the response you will get a token if you log in successfully.