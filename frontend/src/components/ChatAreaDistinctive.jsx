import React, { useEffect, useRef } from 'react';
import { Copy, Check, ThumbsUp, ThumbsDown } from 'lucide-react';

export default function ChatAreaDistinctive({ messages, isLoading }) {
  const messagesEndRef = useRef(null);
  const [copiedId, setCopiedId] = React.useState(null);
  const [hoveredId, setHoveredId] = React.useState(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Playfair+Display:wght@700&display=swap');

        .empty-state {
          background: radial-gradient(circle at 30% 60%, rgba(167, 139, 250, 0.1) 0%, transparent 50%),
                      radial-gradient(circle at 70% 40%, rgba(96, 165, 250, 0.1) 0%, transparent 50%);
        }

        .message-container {
          animation: slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .message-user {
          background: linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%);
          box-shadow: 0 8px 24px rgba(139, 92, 246, 0.4),
                      inset 0 1px 0 rgba(255, 255, 255, 0.2);
        }

        .message-assistant {
          background: rgba(15, 23, 42, 0.4);
          border: 1px solid rgba(167, 139, 250, 0.25);
          backdrop-filter: blur(10px);
        }

        .avatar-ai {
          background: linear-gradient(135deg, #a78bfa 0%, #60a5fa 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          color: #1e1b4b;
        }

        .action-btn {
          opacity: 0.5;
          transition: all 0.2s ease;
        }

        .action-btn:hover {
          opacity: 1;
          background: rgba(167, 139, 250, 0.1);
        }

        .prompt-card {
          background: rgba(30, 27, 75, 0.6);
          border: 1px solid rgba(167, 139, 250, 0.2);
          backdrop-filter: blur(10px);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .prompt-card:hover {
          border-color: rgba(167, 139, 250, 0.5);
          background: rgba(30, 27, 75, 0.8);
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(167, 139, 250, 0.15);
        }

        .code-text {
          font-family: 'JetBrains Mono', monospace;
        }

        .brand-text {
          font-family: 'Playfair Display', serif;
          font-weight: 700;
        }
      `}</style>

      <div className="max-w-4xl mx-auto py-12">
        {messages.length === 0 ? (
          // Empty State
          <div className="empty-state flex flex-col items-center justify-center h-full py-32 px-4 rounded-3xl">
            <div className="mb-8 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-400 to-blue-400 text-slate-900 text-4xl font-bold mb-6 shadow-lg">
                ✦
              </div>
              <h1 className="brand-text text-4xl text-slate-100 mb-3">
                What can we create today?
              </h1>
              <p className="text-slate-400 text-lg max-w-md mx-auto">
                Upload documents, images, or just ask. I'm here to help you think bigger.
              </p>
            </div>

            {/* Prompt Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-xl mt-12">
              {[
                {
                  icon: '⚡',
                  title: 'Rapid Analysis',
                  desc: 'Extract insights from your files'
                },
                {
                  icon: '🎨',
                  title: 'Creative Brainstorm',
                  desc: 'Generate ideas and concepts'
                },
                {
                  icon: '📚',
                  title: 'Document Mastery',
                  desc: 'Understand complex documents'
                },
                {
                  icon: '🔧',
                  title: 'Problem Solving',
                  desc: 'Debug and optimize anything'
                }
              ].map((card, idx) => (
                <button
                  key={idx}
                  className="prompt-card p-5 rounded-xl text-left group"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-3xl">{card.icon}</span>
                    <div>
                      <p className="font-semibold text-slate-200 group-hover:text-purple-300 transition-colors">
                        {card.title}
                      </p>
                      <p className="text-sm text-slate-400 mt-1">{card.desc}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          // Messages
          <div className="px-4 py-12 space-y-8">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`message-container flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                onMouseEnter={() => msg.role === 'assistant' && setHoveredId(idx)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {msg.role === 'assistant' && (
                  <div className="w-9 h-9 flex-shrink-0 rounded-lg avatar-ai text-sm">
                    C
                  </div>
                )}

                <div className={`flex-1 max-w-2xl ${msg.role === 'user' ? 'text-right' : ''}`}>
                  <div className={`${msg.role === 'user' ? 'message-user inline-block' : 'message-assistant max-w-2xl'} rounded-2xl px-6 py-4`}>
                    <p className="text-slate-100 text-sm leading-relaxed whitespace-pre-wrap break-words font-light">
                      {msg.content}
                    </p>
                  </div>

                  {/* Actions */}
                  {msg.role === 'assistant' && hoveredId === idx && (
                    <div className="flex gap-2 mt-3 opacity-100 transition-opacity">
                      <button
                        onClick={() => copyToClipboard(msg.content, idx)}
                        className="action-btn p-2 rounded transition-all"
                        title="Copy"
                      >
                        {copiedId === idx ? (
                          <Check size={16} className="text-green-400" />
                        ) : (
                          <Copy size={16} className="text-purple-400" />
                        )}
                      </button>
                      <button className="action-btn p-2 rounded transition-all" title="Good">
                        <ThumbsUp size={16} className="text-purple-400" />
                      </button>
                      <button className="action-btn p-2 rounded transition-all" title="Bad">
                        <ThumbsDown size={16} className="text-purple-400" />
                      </button>
                    </div>
                  )}
                </div>

                {msg.role === 'user' && (
                  <div className="w-9 h-9 flex-shrink-0 rounded-lg bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center text-sm font-bold text-slate-100">
                    U
                  </div>
                )}
              </div>
            ))}

            {/* Loading */}
            {isLoading && (
              <div className="message-container flex gap-4">
                <div className="w-9 h-9 flex-shrink-0 rounded-lg avatar-ai text-sm">
                  C
                </div>
                <div className="flex items-center gap-2 px-6 py-4">
                  <div className="loading-dots code-text">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}