import { Sequelize } from 'sequelize';
import User from './models/User.js';

const sequelize = new Sequelize('chatbot', 'root', 'qazwsx123', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false,
});

async function resetUser() {
    try {
        const deleted = await User.destroy({
            where: { email: 'hello@gmail.com' }
        });
        console.log(`Deleted ${deleted} user(s). Account reset.`);
        await sequelize.close();
    } catch (error) {
        console.error('Error resetting user:', error);
    }
}

resetUser();
