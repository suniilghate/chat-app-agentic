import React, { useState, useEffect } from 'react';
import './App.css';

function Agent() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [selectedClient, setSelectedClient] = useState(null);
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const newSocket = new WebSocket('ws://localhost:5050');
        setSocket(newSocket);

        newSocket.onopen = () => {
            console.log('WebSocket connected (Agent)');
            newSocket.send(JSON.stringify({ type: 'agent-login' }));
        };

        newSocket.onmessage = (event) => {
            const message = JSON.parse(event.data.toString());

            if (message.type === 'incoming-message') {
                setMessages(prev => [...prev, `User: ${message.msg}`]);
                setSelectedClient(message.from);
            }
        };

        newSocket.onclose = () => {
            console.log('WebSocket closed (Agent)');
        };

        newSocket.onerror = (error) => {
            console.error('WebSocket error (Agent):', error);
        };

        return () => newSocket.close();
    }, []);

    const sendReply = () => {
        if (input.trim() && socket && socket.readyState === WebSocket.OPEN && selectedClient) {
            const payload = {
                type: 'agent-reply',
                to: selectedClient,
                msg: input
            };
            socket.send(JSON.stringify(payload));
            setMessages(prev => [...prev, `You: ${input}`]);
            setInput('');
        }
    };

    return (
        <div className="App">
            <h2>Agent Panel</h2>
            <div className="chat-window">
                {messages.map((msg, i) => (
                    <div key={i} className="message">{msg}</div>
                ))}
            </div>
            <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyUp={e => e.key === 'Enter' && sendReply()}
            />
            <button onClick={sendReply}>Send</button>
        </div>
    );
}

export default Agent;
