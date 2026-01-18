# AI Chatbot - Full Stack Application

A fully functional AI-powered chatbot built with **Node.js**, **React (Vite)**, and **MongoDB Atlas**.

## 🌟 Features

- 💬 Real-time AI chat using OpenAI GPT-3.5
- 📝 Conversation history with MongoDB Atlas
- 🔄 Multiple conversation management
- 🎨 Beautiful, responsive UI
- ⚡ Fast performance with Vite
- 🗑️ Delete conversations
- 💾 Persistent chat storage

## 🛠️ Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB Atlas (Database)
- OpenAI API (AI Integration)
- Mongoose (ODM)

### Frontend
- React 18
- Vite
- Axios
- Lucide React (Icons)

## 📋 Prerequisites

Before you begin, ensure you have:
- Node.js (v16 or higher)
- MongoDB Atlas account
- OpenAI API key

## 🚀 Setup Instructions

### 1. Clone or Download the Project

### 2. Backend Setup

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Create .env file
copy .env.example .env
```

Edit the `.env` file and add your credentials:
```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
OPENAI_API_KEY=your_openai_api_key
```

**Get MongoDB Atlas URI:**
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Click "Connect" → "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your database password

**Get OpenAI API Key:**
1. Go to [OpenAI Platform](https://platform.openai.com)
2. Sign up or log in
3. Go to API Keys section
4. Create a new API key
5. Copy the key

```bash
# Start the backend server
npm run dev
```

Backend will run on `http://localhost:5000`

### 3. Frontend Setup

Open a **new terminal** window:

```bash
# Navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

Frontend will run on `http://localhost:3000`

## 🎯 Usage

1. Open your browser and go to `http://localhost:3000`
2. Start chatting with the AI!
3. Your conversations are automatically saved
4. Create new conversations using the "New Chat" button
5. Access previous conversations from the sidebar

## 📁 Project Structure

```
chatbot/
├── backend/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── controllers/
│   │   └── chatController.js    # Chat logic & AI integration
│   ├── models/
│   │   ├── Message.js           # Message schema
│   │   └── Conversation.js      # Conversation schema
│   ├── routes/
│   │   └── chatRoutes.js        # API routes
│   ├── .env.example             # Environment variables template
│   ├── package.json
│   └── server.js                # Express server
│
└── frontend/
    ├── src/
    │   ├── App.jsx              # Main chat component
    │   ├── App.css              # Styles
    │   ├── main.jsx             # Entry point
    │   └── index.css            # Global styles
    ├── index.html
    ├── package.json
    └── vite.config.js           # Vite configuration
```

## 🔌 API Endpoints

- `POST /api/chat/message` - Send a message and get AI response
- `GET /api/chat/conversation/:conversationId` - Get conversation history
- `GET /api/chat/conversations` - Get all conversations
- `DELETE /api/chat/conversation/:conversationId` - Delete a conversation

## 🎨 Features in Detail

### Chat Interface
- Clean, modern design
- Real-time message updates
- Typing indicators
- Smooth animations

### Conversation Management
- Create multiple conversations
- Switch between conversations
- Delete old conversations
- Automatic conversation naming

### AI Integration
- Powered by OpenAI GPT-3.5
- Context-aware responses
- Conversation history maintained
- Error handling

## 🐛 Troubleshooting

### Backend won't start
- Check if MongoDB URI is correct
- Verify OpenAI API key
- Ensure port 5000 is not in use

### Frontend won't connect
- Ensure backend is running on port 5000
- Check browser console for errors
- Verify CORS is enabled in backend

### AI responses not working
- Check OpenAI API key is valid
- Verify you have credits in OpenAI account
- Check backend logs for errors

## 🔧 Configuration

### Change AI Model
Edit `backend/controllers/chatController.js`:
```javascript
model: 'gpt-4', // Change from gpt-3.5-turbo
```

### Change Port
Edit `backend/.env`:
```env
PORT=8000
```

Edit `frontend/vite.config.js`:
```javascript
target: 'http://localhost:8000',
```

## 📝 License

This project is open source and available for educational purposes.

## 🤝 Contributing

Feel free to fork this project and make improvements!

## 📧 Support

If you encounter any issues, please check the troubleshooting section or create an issue in the repository.

---

**Happy Chatting! 🚀**
