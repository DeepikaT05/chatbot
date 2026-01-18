import mysql from 'mysql2/promise';

async function createDatabase() {
    try {
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'qazwsx123',
        });

        await connection.query(`CREATE DATABASE IF NOT EXISTS chatbot;`);
        console.log('✅ Database "chatbot" created or already exists.');
        await connection.end();
    } catch (error) {
        console.error('❌ Error creating database:', error);
    }
}

createDatabase();
