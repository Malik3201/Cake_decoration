import { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import api from '../utils/api.js';
import { ChatIcon } from '../utils/icons.jsx';

const initialMessage = {
  role: 'assistant',
  content: 'Hi there! I\'m your DecoraBake assistant. Ask me about cake ideas, flavors, or customization suggestions!',
};

const ChatbotWidget = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([initialMessage]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const listRef = useRef(null);

  useEffect(() => {
    if (!listRef.current) return;
    listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages, loading]);

  const send = async () => {
    if (!input.trim()) return;
    
    // Store clean message without language tag
    const displayMessage = input.trim();
    const userMessage = {
      role: 'user',
      content: displayMessage,
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    
    try {
      const { data } = await api.post('/api/ai/chat', {
        messages: [...messages, userMessage].map(m => ({
          role: m.role,
          content: m.content,
        })),
      });
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, I\'m having trouble connecting right now. Please try again in a moment.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-40">
      {open && (
        <div className="mb-3 w-80 sm:w-96 rounded-3xl shadow-[0_24px_80px_rgba(244,114,182,0.4)] border border-pink-100 bg-white flex flex-col overflow-hidden animate-[slideUp_0.3s_ease-out]">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-[hsl(340,82%,45%)] to-[hsl(340,72%,55%)]">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-white/20 flex items-center justify-center">
                <span className="text-white text-lg">🎂</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-white">
                  Cake Assistant
                </p>
                <p className="text-[10px] text-white/80">
                  Ask me anything about cakes
                </p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="h-7 w-7 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/30 transition"
            >
              ×
            </button>
          </div>

          {/* Messages */}
          <div
            ref={listRef}
            className="flex-1 max-h-80 overflow-y-auto px-4 py-4 space-y-3 bg-gradient-to-b from-pink-50/50 to-white"
          >
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex gap-2 ${
                  m.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {m.role === 'assistant' && (
                  <div className="h-7 w-7 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-xs">🍰</span>
                  </div>
                )}
                <div
                  className={`max-w-[85%] text-sm leading-relaxed shadow-sm ${
                    m.role === 'user'
                      ? 'bg-gradient-to-br from-[hsl(340,82%,45%)] to-[hsl(340,72%,52%)] text-white rounded-2xl rounded-br-md px-4 py-2.5 prose prose-sm max-w-none prose-invert prose-p:my-1 prose-ul:my-1 prose-ul:pl-4 prose-li:my-0'
                      : 'bg-white text-slate-700 rounded-2xl rounded-bl-md px-4 py-2.5 border border-pink-50 prose prose-sm max-w-none prose-p:my-1 prose-ul:my-1 prose-ul:pl-4 prose-li:my-0'
                  }`}
                >
                  <ReactMarkdown 
                    components={{
                      p: ({node, ...props}) => <p className="mb-1 last:mb-0" {...props} />,
                      ul: ({node, ...props}) => <ul className="list-disc pl-4 mb-2 last:mb-0" {...props} />,
                      li: ({node, ...props}) => <li className="mb-0.5" {...props} />,
                      a: ({node, ...props}) => <a className="underline hover:text-pink-200" {...props} />,
                    }}
                  >
                    {m.content}
                  </ReactMarkdown>
                </div>
                {m.role === 'user' && (
                  <div className="h-7 w-7 rounded-full bg-[hsl(340,82%,45%)] flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-[10px] font-bold">U</span>
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex gap-2 justify-start">
                <div className="h-7 w-7 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs">🍰</span>
                </div>
                <div className="bg-white text-slate-500 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm border border-pink-50 flex items-center gap-1">
                  <span className="inline-flex h-2 w-2 rounded-full bg-pink-300 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="inline-flex h-2 w-2 rounded-full bg-pink-300 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="inline-flex h-2 w-2 rounded-full bg-pink-300 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t border-pink-100 px-3 py-3 bg-white">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about cake ideas..."
                className="flex-1 text-sm rounded-full border border-pink-100 bg-slate-50 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[hsl(340,82%,72%)] focus:bg-white"
              />
              <button
                type="button"
                onClick={send}
                disabled={loading || !input.trim()}
                className="h-10 w-10 rounded-full bg-[hsl(340,82%,45%)] text-white flex items-center justify-center shadow-lg hover:bg-[hsl(340,82%,40%)] transition disabled:opacity-50"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="h-14 w-14 rounded-full bg-gradient-to-br from-[hsl(340,82%,45%)] to-[hsl(340,72%,55%)] text-white shadow-[0_8px_32px_rgba(244,114,182,0.5)] flex items-center justify-center hover:scale-105 transition-transform"
        aria-label="Open AI assistant"
      >
        {open ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <ChatIcon className="w-6 h-6" />
        )}
      </button>
    </div>
  );
};

export default ChatbotWidget;
