import { Client } from 'pg';

const client = new Client({
    connectionString: process.env.DATABASE_URL
});

export async function connectDB() {
    await client.connect()
    console.log('Connected to database')
}

export async function createTables() {
    await client.query(`
        create table if not exists users (
            id serial primary key,
            username varchar(255) unique not null,
            password varchar(255) not null
        )    
    `);

    console.log('Tables created');
};

export default client