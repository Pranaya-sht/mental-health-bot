import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import './App.css';
import { useUser } from '@clerk/clerk-react';
;
import Message from './component/Message';

function App() {
  const { isSignedIn, user, isLoaded } = useUser()
  //console.log(user)
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const chatBoxRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userMessage = { text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);

    try {
      const response = await fetch('http://127.0.0.1:8000/prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: input }),
      });

      const data = await response.json();

      if (response.ok) {
        // Use the primary response from the bot
        const botMessage = {
          text: data.response,
          sender: 'bot',
          // Optionally store all responses if you want to use them later
          allResponses: data.all_responses
        };
        setMessages(prev => [...prev, botMessage]);
      } else {
        setMessages(prev => [...prev, {
          text: "Sorry, I couldn't process your request.",
          sender: 'bot'
        }]);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        text: "Sorry, I couldn't reach the server.",
        sender: 'bot'
      }]);
    }

    setInput('');
  };

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  const renderMessageText = (text) => {
    const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+)/g;
    const parts = text.split(urlRegex);

    return parts.map((part, index) =>
      urlRegex.test(part) ? (
        <a
          key={index}
          href={part.startsWith('http') ? part : `http://${part}`}
          target="_blank"
          rel="noopener noreferrer"
          className="neon-link"
        >
          {part}
        </a>
      ) : (
        part
      )
    );
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-200">
      <h1 className="text-center text-3xl font-bold text-blue-500 neon-text h-10">
        Mental Health Chatbot
      </h1>

      <div
        className="chat-box flex-grow overflow-y-auto p-4 space-y-4 bg-gray-800 shadow-inner rounded-lg neon-border"
        ref={chatBoxRef}
      >
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message flex ${message.sender === "user" ? "justify-end" : "justify-start"
              }`}
          >
            <p
              className={`p-3 rounded-lg ${message.sender === "user"
                ? "bg-cyan-600 text-gray-100"
                : "bg-gray-700 text-gray-300"
                } neon-border`}
            >
              {message.sender === "user" ? renderMessageText(message.text) : <Message text={message.text}></Message>}
            </p>
          </div>
        ))}
      </div>

      <form
        onSubmit={handleSubmit}
        className="input-container flex items-center bg-gray-800 p-4 rounded-t-lg shadow-md neon-border"
      >
        <input
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-grow bg-gray-700 text-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 neon-input"
        />
        <button
          type="submit"
          className="ml-4 px-6 py-3 bg-cyan-600 text-gray-200 font-semibold rounded-lg hover:bg-cyan-700 focus:ring-2 focus:ring-cyan-500 neon-btn"
        >
          Send
        </button>
      </form>
    </div>

  );
}

export default App;

