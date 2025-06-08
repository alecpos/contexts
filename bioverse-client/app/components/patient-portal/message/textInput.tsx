'use client';

import { useState } from 'react';
import { TextField, Button } from '@mui/material';

const TextInput = () => {
    const [messages, setMessages] = useState<string[]>([]);
    const [currentMessage, setCurrentMessage] = useState('');

    const handleSend = () => {
        if (currentMessage) {
            setMessages([...messages, currentMessage]);
            setCurrentMessage('');
        }
    };

    return (
        <div className="flex flex-col h-screen p-4">
            <div className="flex-1 overflow-y-auto">
                {messages.map((message, index) => (
                    <div key={index} className="m-2 p-2 bg-blue-100 rounded">
                        {message}
                    </div>
                ))}
            </div>
            <div className="flex">
                <TextField
                    variant="outlined"
                    fullWidth
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSend}
                >
                    Send
                </Button>
            </div>
        </div>
    );
};

export default TextInput;
