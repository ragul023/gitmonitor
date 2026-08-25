import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { Bot, Send, Sparkles } from 'lucide-react';
import ChatMessage from '../../Components/ChatMessage/ChatMessage';
import { suggestedQuestions, aiResponses, defaultAiResponse } from '../../data/mockData';
import './AI.css';

function AI() {
  const containerRef = useRef(null);
  const messagesEndRef = useRef(null);
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Hi! I\'m your repository assistant. Ask me anything about your repository activity, or try one of the suggested questions below.' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.ai-page-header', { opacity: 0, y: 20, duration: 0.5, ease: 'power2.out' });
      gsap.from('.ai-suggested-chip', { opacity: 0, y: 15, duration: 0.4, stagger: 0.06, delay: 0.1, ease: 'power2.out' });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = (text) => {
    const msg = text || input;
    if (!msg.trim() || loading) return;

    setMessages((prev) => [...prev, { role: 'user', text: msg }]);
    setInput('');
    setLoading(true);

    setTimeout(() => {
      const response = aiResponses[msg] || [defaultAiResponse];
      setMessages((prev) => [...prev, { role: 'ai', text: response[0] }]);
      setLoading(false);
    }, 1500);
  };

  return (
    <div ref={containerRef} className="ai-page">
      <div className="ai-page-header">
        <div className="ai-page-header-icon">
          <Bot size={24} />
        </div>
        <div>
          <h1 className="ai-page-title">Ask your repository</h1>
          <p className="ai-page-subtitle">AI-powered insights about your GitHub activity</p>
        </div>
      </div>

      <div className="ai-chat-container glass">
        <div className="ai-chat-messages">
          {messages.map((msg, i) => (
            <ChatMessage key={i} message={msg} />
          ))}

          {loading && (
            <div className="chat-message chat-message--ai">
              <div className="chat-message-avatar">
                <Bot size={18} />
              </div>
              <div className="chat-message-body">
                <div className="chat-message-author">AI Assistant</div>
                <div className="ai-typing">
                  <span /><span /><span />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {messages.length <= 1 && (
          <div className="ai-suggested">
            <div className="ai-suggested-label">
              <Sparkles size={14} />
              Suggested questions
            </div>
            <div className="ai-suggested-list">
              {suggestedQuestions.map((q, i) => (
                <button
                  key={i}
                  className="ai-suggested-chip"
                  onClick={() => handleSend(q)}
                  disabled={loading}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="ai-input-area">
          <input
            type="text"
            placeholder="Ask about your repository activity..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            disabled={loading}
          />
          <button className="ai-send-btn" onClick={() => handleSend()} disabled={loading || !input.trim()}>
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default AI;
