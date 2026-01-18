import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
import Conversation from './Conversation.js';

const Message = sequelize.define('Message', {
  role: {
    type: DataTypes.ENUM('user', 'assistant', 'system'),
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  conversationId: {
    type: DataTypes.INTEGER,
    references: {
      model: Conversation,
      key: 'id'
    }
  }
});

// Define Relationship
Conversation.hasMany(Message, { foreignKey: 'conversationId', onDelete: 'CASCADE' });
Message.belongsTo(Conversation, { foreignKey: 'conversationId' });

export default Message;
