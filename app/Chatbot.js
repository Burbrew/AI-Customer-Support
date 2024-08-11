// src/app/Chatbot.js
'use client';

import { useState, useRef, useEffect } from 'react';
import { Box, Button, Stack, TextField, Typography } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

const botPrompts = {
  coding: "Hi! I'm the Coding assistant. How can I help you today?",
  mathematics: "Hi! I'm the Mathematics assistant. How can I help you today?",
  history: "Hi! I'm the History assistant. How can I help you today?",
  english: "Hi! I'm the English assistant. How can I help you today?",
  science: "Hi! I'm the Science assistant. How can I help you today?",
};

export default function Chatbot({ botType }) {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Reset messages when botType changes
  useEffect(() => {
    setMessages([
      {
        role: 'assistant',
        content: `### Hi! I'm the ${botType.charAt(0).toUpperCase() + botType.slice(1)} assistant.\n\nHow can I help you today?`,
      },
    ]);
  }, [botType]);

  const sendMessage = async () => {
    if (!message.trim() || isLoading) return;

    setIsLoading(true);
    const userMessage = message;
    setMessage('');

    setMessages((prevMsgs) => [
      ...prevMsgs,
      { role: 'user', content: userMessage },
      { role: 'assistant', content: '' },
    ]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-bot-type': botType.toLowerCase(),  // Convert botType to lowercase
        },
        body: JSON.stringify({ messages: [...messages, { role: 'user', content: userMessage }] }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const responseData = await response.text();

      setMessages((prevMsgs) => {
        const updatedMessages = [...prevMsgs];
        updatedMessages[updatedMessages.length - 1].content = responseData;
        return updatedMessages;
      });
    } catch (error) {
      console.error('Error:', error);
      setMessages((prevMsgs) => [
        ...prevMsgs,
        { role: 'assistant', content: "I'm sorry, but I encountered an error. Please try again later." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <Box
      width="100%"
      height="100%"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      bgcolor="white"
    >
      <Stack
        direction="column"
        width="500px"
        height="700px"
        border="1px solid black"
        borderRadius="20px"
        p={2}
        spacing={3}
      >
        <Typography variant="h6" align="center" color="primary">
          {`${botType.charAt(0).toUpperCase() + botType.slice(1)} Support Chatbot`}
        </Typography>
        <Stack
          direction="column"
          spacing={2}
          flexGrow={1}
          overflow="auto"
          maxHeight="100%"
        >
          {messages.map((msg, index) => (
            <Box
              key={index}
              display="flex"
              justifyContent={msg.role === 'assistant' ? 'flex-start' : 'flex-end'}
            >
              <Box
                bgcolor={msg.role === 'assistant' ? 'primary.main' : 'secondary.main'}
                color="white"
                borderRadius="20px"
                p={2}
                sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
              >
                {msg.role === 'assistant' ? (
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw]}
                  >
                    {msg.content}
                  </ReactMarkdown>
                ) : (
                  msg.content
                )}
              </Box>
            </Box>
          ))}
          <div ref={messagesEndRef} />
        </Stack>
        <Stack direction="row" spacing={2}>
          <TextField
            label="Type your message..."
            fullWidth
            variant="outlined"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={isLoading}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
          />
          <Button
            variant="contained"
            onClick={sendMessage}
            disabled={isLoading}
          >
            {isLoading ? 'Sending...' : 'Send'}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
