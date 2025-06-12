import React, { useState, useEffect, useRef } from 'react';

const ChatCard = ({ recipientName = 'Agent John' }) => {
  const [messages, setMessages] = useState([
    { from: 'agent', text: 'Hello! How can I assist you today?' },
    { from: 'user', text: 'Hi, I am interested in the property in Dar.' },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const chatRef = useRef(null);

  useEffect(() => {
    // Scroll to bottom when new message arrives
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = e => {
    e.preventDefault();
    if (newMessage.trim() === '') return;

    setMessages(prev => [...prev, { from: 'user', text: newMessage }]);
    setNewMessage('');

    // Simulate agent auto-reply after 1.5s
    setTimeout(() => {
      setMessages(prev => [...prev, { from: 'agent', text: 'Thanks for reaching out. I will get back to you shortly.' }]);
    }, 1500);
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded shadow-lg flex flex-col">
      <div className="bg-blue-600 text-white p-4 rounded-t">
        <h2 className="text-lg font-bold">Chat with {recipientName}</h2>
      </div>

      <div
        ref={chatRef}
        className="flex-1 overflow-y-auto p-4 space-y-3 h-80 bg-gray-50"
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.from === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`px-4 py-2 rounded-lg max-w-xs ${
                msg.from === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSend} className="flex p-3 border-t">
        <input
          type="text"
          placeholder="Type your message..."
          value={newMessage}
          onChange={e => setNewMessage(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-l focus:outline-none focus:ring focus:ring-blue-300"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-r hover:bg-blue-700 transition"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatCard;
