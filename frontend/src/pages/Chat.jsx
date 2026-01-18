import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import {
    Send, Plus, MessageSquare, LogOut, Menu, X,
    User, Bot, ChevronRight, Loader2
} from 'lucide-react';

const Chat = () => {
    const { user, logout } = useAuth();
    const [conversations, setConversations] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        fetchConversations();
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const fetchConversations = async () => {
        try {
            const { data } = await axios.get('http://localhost:5002/api/chat');
            setConversations(data);
        } catch (error) {
            console.error('Error fetching conversations:', error);
        }
    };

    const loadConversation = async (id) => {
        try {
            // Optimistically set UI state
            const chat = conversations.find(c => c._id === id);
            if (chat) {
                setCurrentChat(chat);
                setMessages(chat.messages || []); // Use persisted messages if available
            }
            setSidebarOpen(false);

            // Fetch full details (optional if list already has messages, but good for heavy loads)
            const { data } = await axios.get(`http://localhost:5002/api/chat/${id}`);
            setCurrentChat(data);
            setMessages(data.messages);
        } catch (error) {
            console.error('Error loading conversation:', error);
        }
    };

    const createNewChat = () => {
        setCurrentChat(null);
        setMessages([]);
        setSidebarOpen(false);
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMessage = input;
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setLoading(true);

        try {
            const { data } = await axios.post('http://localhost:5002/api/chat', {
                message: userMessage,
                conversationId: currentChat?._id
            });

            setMessages(data.history); // Update with server history (includes AI response)

            if (!currentChat) {
                // If it was a new chat, refresh list and set current
                await fetchConversations();
                setCurrentChat({ _id: data.conversationId }); // Minimal set to link next msg
            }
        } catch (error) {
            console.error('Error sending message:', error);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: 'Sorry, I encountered an error. Please try again.'
            }]);
        }
        setLoading(false);
    };

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden">
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-20 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed lg:static inset-y-0 left-0 w-72 bg-slate-900 text-slate-300 transform transition-transform duration-300 z-30 flex flex-col ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                    }`}
            >
                <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-white font-bold text-xl">
                        <Bot className="text-primary-400" />
                        <span>AI Assistant</span>
                    </div>
                    <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1 hover:bg-slate-800 rounded">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-4">
                    <button
                        onClick={createNewChat}
                        className="w-full flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg px-4 py-3 transition-colors font-medium"
                    >
                        <Plus size={20} />
                        New Chat
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-2 py-2">
                    <div className="space-y-1">
                        {conversations.map((chat) => (
                            <button
                                key={chat._id}
                                onClick={() => loadConversation(chat._id)}
                                className={`w-full text-left px-3 py-3 rounded-lg flex items-center gap-3 transition-colors ${currentChat?._id === chat._id
                                    ? 'bg-slate-800 text-white'
                                    : 'hover:bg-slate-800/50 hover:text-white'
                                    }`}
                            >
                                <MessageSquare size={18} className="shrink-0" />
                                <span className="truncate text-sm">{chat.title || 'New Conversation'}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="p-4 border-t border-slate-800">
                    <div className="flex items-center gap-3 mb-4 px-2">
                        <div className="h-8 w-8 rounded-full bg-primary-900 flex items-center justify-center text-primary-200">
                            <User size={16} />
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <p className="text-sm font-medium text-white truncate">{user?.username || 'User'}</p>
                            <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        className="w-full flex items-center gap-2 text-slate-400 hover:text-white px-2 py-2 rounded-lg hover:bg-slate-800/50 transition-colors text-sm"
                    >
                        <LogOut size={18} />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-full w-full">
                {/* Header */}
                <header className="bg-white border-b border-slate-200 h-16 flex items-center px-4 justify-between lg:justify-end">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="p-2 -ml-2 hover:bg-slate-100 rounded-lg lg:hidden"
                    >
                        <Menu size={24} className="text-slate-600" />
                    </button>

                    <div className="lg:hidden font-medium text-slate-700">
                        AI Assistant
                    </div>

                    <div className="hidden lg:flex items-center gap-2 text-sm text-slate-500">
                        <span className="px-2 py-1 bg-slate-100 rounded text-xs font-mono">Model: llama3-8b</span>
                    </div>
                </header>

                {/* Chat Area */}
                <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
                    {!currentChat && messages.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-0 animate-[fadeIn_0.5s_ease-out_forwards]" style={{ animationDelay: '0.1s', opacity: 1 }}>
                            <div className="h-20 w-20 bg-primary-100 rounded-2xl flex items-center justify-center text-primary-600 mb-6">
                                <Bot size={40} />
                            </div>
                            <h1 className="text-2xl font-bold text-slate-800 mb-2">How can I help you today?</h1>
                            <p className="text-slate-500 max-w-md">
                                I'm a large language model, trained by Google. I can help you with writing, learning, coding, and more.
                            </p>
                        </div>
                    ) : (
                        messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`flex gap-4 max-w-4xl mx-auto ${msg.role === 'user' ? 'justify-end' : 'justify-start'
                                    }`}
                            >
                                {msg.role !== 'user' && (
                                    <div className="h-8 w-8 rounded-lg bg-primary-100 flex items-center justify-center text-primary-600 shrink-0 mt-1">
                                        <Bot size={18} />
                                    </div>
                                )}

                                <div
                                    className={`relative px-5 py-3.5 rounded-2xl shadow-sm text-sm leading-relaxed max-w-[85%] md:max-w-[75%] ${msg.role === 'user'
                                        ? 'bg-primary-600 text-white rounded-br-none'
                                        : 'bg-white border border-slate-100 text-slate-700 rounded-bl-none'
                                        }`}
                                >
                                    <div className="whitespace-pre-wrap">{msg.content}</div>
                                </div>

                                {msg.role === 'user' && (
                                    <div className="h-8 w-8 rounded-lg bg-slate-200 flex items-center justify-center text-slate-600 shrink-0 mt-1">
                                        <User size={18} />
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                    {loading && (
                        <div className="flex gap-4 max-w-4xl mx-auto justify-start">
                            <div className="h-8 w-8 rounded-lg bg-primary-100 flex items-center justify-center text-primary-600 shrink-0 mt-1">
                                <Bot size={18} />
                            </div>
                            <div className="bg-white border border-slate-100 px-4 py-3 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-2">
                                <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white border-t border-slate-200">
                    <div className="max-w-4xl mx-auto relative">
                        <form onSubmit={sendMessage} className="relative flex items-end gap-2 bg-slate-50 border border-slate-300 rounded-xl p-2 focus-within:ring-2 focus-within:ring-primary-500/50 focus-within:border-primary-500 transition-all shadow-sm">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Type your message..."
                                className="w-full bg-transparent border-none focus:ring-0 text-slate-700 placeholder-slate-400 min-h-[44px] max-h-32 py-2.5 px-2 resize-none"
                                disabled={loading}
                            />
                            <button
                                type="submit"
                                disabled={!input.trim() || loading}
                                className="p-2.5 bg-primary-600 hover:bg-primary-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors shrink-0 mb-0.5"
                            >
                                <Send size={18} />
                            </button>
                        </form>
                        <div className="text-center mt-2 text-xs text-slate-400">
                            AI can make mistakes. Consider checking important information.
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Chat;
