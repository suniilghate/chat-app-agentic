import React, { useState, useEffect } from 'react';
import './App.css';

function User() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [agentOnline, setAgentOnline] = useState(false);
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const newSocket = new WebSocket('wss://chat-app-agentic.onrender.com');
        setSocket(newSocket);

        newSocket.onopen = () => {
            console.log('WebSocket connected (User)');
        };

        newSocket.onmessage = (event) => {
            const message = JSON.parse(event.data.toString());

            if (message.type === 'waiting-message') {
                setMessages(prev => [...prev, `System: ${message.msg}`]);
            } else if (message.type === 'chat-reply') {
                setMessages(prev => [...prev, `Agent: ${message.msg}`]);
            } else if (message.type === 'agent-status') {
                setAgentOnline(message.status);
            }
        };

        newSocket.onclose = () => {
            console.log('WebSocket closed (User)');
        };

        newSocket.onerror = (error) => {
            console.error('WebSocket error (User):', error);
        };

        return () => newSocket.close();
    }, []);

    const sendMessage = () => {
        if (input.trim() && socket && socket.readyState === WebSocket.OPEN) {
            const payload = { type: 'user-message', msg: input };
            socket.send(JSON.stringify(payload));
            setMessages(prev => [...prev, `You: ${input}`]);
            setInput('');
        }
    };

    return (
        <div className="App">
            <h2>User Chat</h2>
            <p>Status: {agentOnline ? "Agent Online" : "Waiting for Agent"}</p>
            <div className="chat-window">
                {messages.map((msg, i) => (
                    <div key={i} className="message">{msg}</div>
                ))}
            </div>
            <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyUp={e => e.key === 'Enter' && sendMessage()}
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
}

export default User;
