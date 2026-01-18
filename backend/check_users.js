import { Sequelize } from 'sequelize';
import User from './models/User.js';

const sequelize = new Sequelize('chatbot', 'root', 'qazwsx123', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false,
});

async function checkUsers() {
    try {
        const users = await User.findAll();
        console.log('Current Users:', JSON.stringify(users, null, 2));
        await sequelize.close();
    } catch (error) {
        console.error('Error checking users:', error);
    }
}

checkUsers();
