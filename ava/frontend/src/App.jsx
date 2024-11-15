import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import Message from './component/Message';
import UserName from './component/UserName';
import { useUser } from '@clerk/clerk-react';

function App() {
  const { isSignedIn, user, isLoaded } = useUser();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const chatBoxRef = useRef(null);

  const firstName = user.firstName;
  const lastName = user.lastName;
  const fullName = `${firstName} ${lastName}`.trim();

  // Handle the submit action for sending a message
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { text: input, sender: 'user' };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

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
        const botMessage = {
          text: data.response.replace(/\n/g, '<br/>'),
          sender: 'bot',
          allResponses: data.all_responses,
        };
        setMessages((prev) => [...prev, botMessage]);
      } else {
        setMessages((prev) => [
          ...prev,
          { text: `Sorry ${firstName}, I couldn't process your request.`, sender: 'bot' },
        ]);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages((prev) => [
        ...prev,
        { text: `Sorry ${firstName}, I couldn't reach the server.`, sender: 'bot' },
      ]);
    }

    setIsLoading(false);
  };

  // Scroll to the bottom of the chat when new messages are added
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  // Scroll to a specific message when clicked
  const scrollToMessage = (index) => {
    const messageElement = document.getElementById(`message-${index}`);
    if (messageElement) {
      messageElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Function to handle downloading the bot's response as a .txt file
  const downloadFile = (text) => {
    // Remove only the HTML tags and preserve spaces and newlines
    const cleanText = text.replace(/<[^>]+>/g, '');  // Strips HTML tags but keeps spaces and line breaks intact

    const blob = new Blob([cleanText], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `bot_response_of_${fullName}.txt`;
    link.click();
  };


  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-200">
      <h1 className="text-center bg-slate-950 text-5xl font-bold text-blue-500 neon-text py-6">
        ManobalAI
        <h1 className="text-xs mt-2 w-full flex justify-end pr-11 text-gray-400 italic font-semibold tracking-wide">
          <UserName />
        </h1>
      </h1>

      <div
        className="chat-box flex-grow overflow-y-auto p-4 space-y-4 bg-gray-800 shadow-inner rounded-lg neon-border"
        ref={chatBoxRef}
      >
        {messages.map((message, index) => (
          <div
            key={index}
            id={`message-${index}`}
            className={`message flex flex-col ${message.sender === 'user' ? 'items-end' : 'items-start'}`}
            onClick={() => scrollToMessage(index)} // Add onClick to scroll to specific message
          >
            {message.sender === 'user' && (
              <p className="text-sm text-gray-400 mb-1">{firstName}</p>
            )}
            {message.sender === 'bot' && (
              <p className="text-sm  text-gray-400 mb-1">ManobalAI</p>
            )}
            <p
              className={`p-3 rounded-lg ${message.sender === 'user'
                ? 'bg-cyan-600 text-gray-100'
                : 'bg-gray-700 text-gray-300'
                } neon-border`}
            >
              <Message text={message.text}></Message>
            </p>
            {message.sender === 'bot' && (
              <button
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                onClick={() => downloadFile(message.text)}
              >
                Download Reply
              </button>
            )}
          </div>
        ))}
        {isLoading && (
          <p className="p-3 bg-gray-700 text-gray-300 rounded-lg neon-border">
            Typing...
          </p>
        )}
      </div>

      {isSignedIn ? (
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
            className="ml-4 px-6 py-3 bg-cyan-600 text-gray-200 font-semibold rounded-lg transition-all duration-300 ease-in-out transform hover:shadow-[0_0_15px_2px_rgba(56,189,248,0.8)] focus:shadow-[0_0_15px_2px_rgba(56,189,248,0.8)] active:scale-95"
          >
            Send
          </button>
        </form>
      ) : (
        <div className="p-4 text-center text-gray-400">
          Please sign in to use the chatbot.
        </div>
      )}
    </div>
  );
}

export default App;
