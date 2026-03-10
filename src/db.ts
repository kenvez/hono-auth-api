import { Pool } from 'pg';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

export async function connectDB() {
    await pool.query('select 1');
    console.log('Connected to database');
}

export async function createTables() {
    await pool.query(`
        create table if not exists users (
            id serial primary key,
            username varchar(255) unique not null,
            password varchar(255) not null
        )    
    `);

    console.log('Tables created');
};

export default pool;