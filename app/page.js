// src/app/page.js
'use client';

import { useState } from 'react';
import Sidebar from './Sidebar';
import Chatbot from './Chatbot'; // Updated import path
import { Box, CssBaseline } from '@mui/material';

export default function Home() {
  const [selectedChatbot, setSelectedChatbot] = useState('coding');

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Sidebar selectedChatbot={selectedChatbot} setSelectedChatbot={setSelectedChatbot} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: 'background.default',
          p: 10,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Chatbot botType={selectedChatbot} />
      </Box>
    </Box>
  );
}
