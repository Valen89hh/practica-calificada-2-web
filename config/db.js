const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL && process.env.DATABASE_URL.includes('localhost')
        ? false
        : { rejectUnauthorized: false }
});

pool.on('connect', () => {
    console.log('Conectado a Postgres');
});

pool.on('error', (err) => {
    console.error('Error en pool de Postgres:', err);
});

module.exports = pool;
