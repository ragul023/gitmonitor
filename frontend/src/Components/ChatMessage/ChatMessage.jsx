import { Bot, User } from 'lucide-react';
import './ChatMessage.css';

function ChatMessage({ message }) {
  const isAI = message.role === 'ai';

  return (
    <div className={`chat-message ${isAI ? 'chat-message--ai' : 'chat-message--user'}`}>
      <div className="chat-message-avatar">
        {isAI ? <Bot size={18} /> : <User size={18} />}
      </div>
      <div className="chat-message-body">
        <div className="chat-message-author">{isAI ? 'AI Assistant' : 'You'}</div>
        <div className="chat-message-content">
          {message.text.split('\n').map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ChatMessage;
