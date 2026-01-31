import React, { useState, useEffect, useRef } from 'react';
import { Send, Menu, X, Plus, Trash2, MessageSquare, Settings, LogOut, Paperclip, Upload } from 'lucide-react';
import LoginModal from './components/LoginModal';
import ChatAreaDistinctive from './components/ChatAreaDistinctive';
import { loginUser, logoutUser, getStoredUser, getStoredToken } from './services/authService';
import { sendMessage, getChatHistory, saveChatHistory, deleteChat as deleteChatAPI } from './services/chatService';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(true);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({ email: '', password: '', confirmPassword: '' });
  const [isSignup, setIsSignup] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const storedUser = getStoredUser();
    const storedToken = getStoredToken();
    if (storedUser && storedToken) {
      setUser(storedUser);
      setIsAuthenticated(true);
      setShowLoginModal(false);
      loadChatHistory();
    }
  }, []);

  const loadChatHistory = async () => {
    try {
      const history = await getChatHistory();
      setChatHistory(history || []);
    } catch (err) {
      console.error('Error loading chat history:', err);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    if (!loginData.email || !loginData.password) {
      setError('Please fill all fields');
      return;
    }

    try {
      const result = await loginUser(loginData.email, loginData.password);
      setUser(result.user);
      setIsAuthenticated(true);
      setShowLoginModal(false);
      setLoginData({ email: '', password: '' });
    } catch (err) {
      setError(err.message || 'Login failed');
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!signupData.email || !signupData.password || !signupData.confirmPassword) {
      setError('Please fill all fields');
      return;
    }

    if (signupData.password !== signupData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const result = await loginUser(signupData.email, signupData.password, true);
      setUser(result.user);
      setIsAuthenticated(true);
      setShowLoginModal(false);
      setSignupData({ email: '', password: '', confirmPassword: '' });
    } catch (err) {
      setError(err.message || 'Signup failed');
    }
  };

  const handleLogout = () => {
    logoutUser();
    setIsAuthenticated(false);
    setUser(null);
    setMessages([]);
    setChatHistory([]);
    setUploadedFiles([]);
    setShowLoginModal(true);
  };

  const createNewChat = () => {
    const chatId = Date.now().toString();
    setCurrentChatId(chatId);
    setMessages([]);
    const newChat = {
      id: chatId,
      title: 'New Chat',
      timestamp: new Date(),
      messages: []
    };
    setChatHistory([newChat, ...chatHistory]);
    setUploadedFiles([]);
  };

  const handleFileUpload = (e, type) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const fileObj = {
        id: Date.now() + Math.random(),
        name: file.name,
        type: type,
        size: (file.size / 1024).toFixed(2),
        file: file
      };
      setUploadedFiles([...uploadedFiles, fileObj]);
    });
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMsg = {
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
      hasFiles: uploadedFiles.length > 0
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);
    setError('');

    try {
      const result = await sendMessage(inputValue, uploadedFiles);
      
      const botMsg = {
        role: 'assistant',
        content: result.response || result.text || 'I encountered an issue processing your request.',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMsg]);

      const updatedMessages = [...messages, userMsg, botMsg];
      
      if (currentChatId) {
        const chatIndex = chatHistory.findIndex(c => c.id === currentChatId);
        if (chatIndex !== -1) {
          const updatedHistory = [...chatHistory];
          updatedHistory[chatIndex].title = inputValue.substring(0, 30) + (inputValue.length > 30 ? '...' : '');
          updatedHistory[chatIndex].messages = updatedMessages;
          setChatHistory(updatedHistory);
          await saveChatHistory(currentChatId, updatedMessages);
        }
      }
      
      setUploadedFiles([]);
    } catch (err) {
      setError(err.message || 'Failed to send message');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteChat = async (chatId) => {
    try {
      await deleteChatAPI(chatId);
      setChatHistory(chatHistory.filter(c => c.id !== chatId));
      if (currentChatId === chatId) {
        setMessages([]);
        setCurrentChatId(null);
      }
    } catch (err) {
      setError('Failed to delete chat');
    }
  };

  const switchChat = (chatId) => {
    const chat = chatHistory.find(c => c.id === chatId);
    if (chat) {
      setCurrentChatId(chatId);
      setMessages(chat.messages || []);
    }
  };

  const deleteFile = (fileId) => {
    setUploadedFiles(uploadedFiles.filter(f => f.id !== fileId));
  };

  if (showLoginModal && !isAuthenticated) {
    return (
      <LoginModal
        loginData={loginData}
        setLoginData={setLoginData}
        signupData={signupData}
        setSignupData={setSignupData}
        isSignup={isSignup}
        setIsSignup={setIsSignup}
        onLogin={handleLogin}
        onSignup={handleSignup}
        error={error}
        setError={setError}
      />
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 font-sans overflow-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&family=Playfair+Display:wght@600;700&display=swap');
        
        :root {
          --accent-primary: #a78bfa;
          --accent-secondary: #60a5fa;
          --accent-glow: #f97316;
          --text-primary: #f8fafc;
          --text-secondary: #cbd5e1;
          --bg-elevated: rgba(15, 23, 42, 0.8);
        }

        .chat-sidebar {
          background: linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 27, 75, 0.95) 100%);
          border-right: 1px solid rgba(167, 139, 250, 0.2);
          backdrop-filter: blur(10px);
        }

        .chat-main {
          background: radial-gradient(ellipse at center, rgba(67, 56, 202, 0.05) 0%, transparent 70%);
        }

        .message-user {
          background: linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%);
          box-shadow: 0 8px 32px rgba(139, 92, 246, 0.3);
        }

        .message-assistant {
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid rgba(167, 139, 250, 0.2);
          backdrop-filter: blur(10px);
        }

        .input-bar {
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid rgba(167, 139, 250, 0.3);
          backdrop-filter: blur(10px);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .input-bar:focus-within {
          border-color: rgba(167, 139, 250, 0.6);
          background: rgba(15, 23, 42, 0.8);
          box-shadow: 0 0 32px rgba(167, 139, 250, 0.2);
        }

        .btn-accent {
          background: linear-gradient(135deg, #a78bfa 0%, #60a5fa 100%);
          box-shadow: 0 4px 16px rgba(167, 139, 250, 0.3);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .btn-accent:hover {
          box-shadow: 0 8px 32px rgba(167, 139, 250, 0.5);
          transform: translateY(-2px);
        }

        .btn-accent:active {
          transform: translateY(0);
        }

        .chat-item {
          transition: all 0.2s ease;
          border-left: 3px solid transparent;
          position: relative;
        }

        .chat-item:hover {
          background: rgba(167, 139, 250, 0.1);
          border-left-color: #a78bfa;
        }

        .chat-item.active {
          background: rgba(167, 139, 250, 0.15);
          border-left-color: #a78bfa;
        }

        .loading-dots {
          display: flex;
          gap: 4px;
        }

        .loading-dots span {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #a78bfa;
          animation: pulse 1.4s infinite;
        }

        .loading-dots span:nth-child(2) {
          animation-delay: 0.2s;
        }

        .loading-dots span:nth-child(3) {
          animation-delay: 0.4s;
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .message-item {
          animation: fadeInUp 0.3s ease;
        }

        .brand-text {
          font-family: 'Playfair Display', serif;
          font-weight: 700;
          letter-spacing: -1px;
        }

        .code-text {
          font-family: 'JetBrains Mono', monospace;
          font-weight: 500;
        }
      `}</style>

      {/* SIDEBAR */}
      <div className={`chat-sidebar ${sidebarOpen ? 'w-72' : 'w-0'} transition-all duration-300 flex flex-col overflow-hidden`}>
        {/* Brand */}
        <div className="px-6 py-6 border-b border-purple-500/20">
          <div className="flex items-center justify-between">
            <h1 className="brand-text text-2xl bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Chatur
            </h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1 hover:bg-purple-500/10 rounded-lg lg:hidden transition-colors"
            >
              <X size={18} className="text-purple-300" />
            </button>
          </div>
        </div>

        {/* New Chat */}
        <div className="px-4 py-4">
          <button
            onClick={createNewChat}
            className="btn-accent w-full flex items-center justify-center gap-2 px-4 py-2 text-white rounded-lg text-sm font-medium"
          >
            <Plus size={16} /> New conversation
          </button>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto px-3 space-y-1">
          {chatHistory.length === 0 ? (
            <p className="text-purple-300/50 text-xs text-center py-6 code-text">No conversations yet</p>
          ) : (
            chatHistory.map(chat => (
              <button
                key={chat.id}
                onClick={() => switchChat(chat.id)}
                className={`chat-item w-full text-left px-3 py-2 rounded-lg group ${
                  currentChatId === chat.id ? 'active' : ''
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <MessageSquare size={14} className="text-purple-400 flex-shrink-0" />
                  <span className="text-sm text-slate-300 truncate">{chat.title}</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteChat(chat.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 absolute right-3 p-1 hover:bg-red-500/20 rounded transition-all"
                >
                  <Trash2 size={12} className="text-red-400" />
                </button>
              </button>
            ))
          )}
        </div>

        {/* Bottom Section */}
        <div className="border-t border-purple-500/20 px-4 py-4 space-y-2">
          <button className="w-full text-left px-3 py-2 text-slate-400 hover:text-purple-300 rounded-lg hover:bg-purple-500/10 transition-all text-sm flex items-center gap-2">
            <Settings size={14} /> Settings
          </button>
          <button
            onClick={handleLogout}
            className="w-full text-left px-3 py-2 text-red-400/80 hover:text-red-300 rounded-lg hover:bg-red-500/10 transition-all text-sm flex items-center gap-2"
          >
            <LogOut size={14} /> Logout
          </button>
        </div>

        {/* User Profile */}
        <div className="border-t border-purple-500/20 px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-blue-400 flex items-center justify-center text-slate-900 font-bold text-xs">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-slate-300">{user?.name}</p>
              <p className="text-xs text-purple-300/50 truncate">{user?.email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-purple-500/20 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 hover:bg-purple-500/10 rounded-lg lg:hidden transition-colors"
            >
              <Menu size={20} className="text-purple-300" />
            </button>
            <h1 className="brand-text text-xl bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent">
              ChaturAI
            </h1>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="px-8 py-3 bg-red-500/10 border-b border-red-500/30 text-red-300 text-sm code-text">
            {error}
          </div>
        )}

        {/* Chat Area */}
        <ChatAreaDistinctive 
          messages={messages} 
          isLoading={isLoading}
        />

        {/* Input Section */}
        <div className="border-t border-purple-500/20 px-8 py-6 backdrop-blur-sm">
          {uploadedFiles.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {uploadedFiles.map(file => (
                <div
                  key={file.id}
                  className="inline-flex items-center gap-2 px-3 py-2 bg-purple-500/10 rounded-lg text-xs text-slate-300 border border-purple-500/20"
                >
                  <span className="code-text">{file.name}</span>
                  <button
                    onClick={() => deleteFile(file.id)}
                    className="text-purple-400 hover:text-red-400 transition-colors"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-3 items-end max-w-4xl mx-auto">
            <div className="input-bar flex-1 flex gap-2 items-center rounded-2xl px-6 py-4">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                placeholder="What's on your mind?"
                disabled={isLoading}
                className="flex-1 bg-transparent text-slate-100 placeholder-purple-300/40 focus:outline-none text-sm"
              />
              
              <label className="p-2 hover:bg-purple-500/10 rounded-lg cursor-pointer transition-colors flex-shrink-0">
                <Paperclip size={16} className="text-purple-400" />
                <input type="file" onChange={(e) => handleFileUpload(e, 'file')} className="hidden" />
              </label>

              <label className="p-2 hover:bg-purple-500/10 rounded-lg cursor-pointer transition-colors flex-shrink-0">
                <Upload size={16} className="text-purple-400" />
                <input type="file" onChange={(e) => handleFileUpload(e, 'image')} className="hidden" accept="image/*" />
              </label>
            </div>

            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              className="btn-accent p-4 text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
            >
              <Send size={18} />
            </button>
          </div>

          <p className="text-center text-purple-300/40 text-xs mt-4 max-w-4xl mx-auto code-text">
            ChaturAI uses AI. Always verify important info.
          </p>
        </div>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 lg:hidden z-40" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  );
}