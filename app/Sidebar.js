// src/app/Sidebar.js
import { List, ListItemButton, ListItemText, Drawer, Box } from '@mui/material';

export default function Sidebar({ selectedChatbot, setSelectedChatbot }) {
  const chatbots = ['Coding', 'Mathematics', 'History', 'English', 'Science'];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 240,
          boxSizing: 'border-box',
        },
      }}
    >
      <Box sx={{ overflow: 'auto' }}>
        <List>
          {chatbots.map((text) => (
            <ListItemButton
              key={text}
              selected={selectedChatbot === text}
              onClick={() => setSelectedChatbot(text)}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: 'rgba(25, 118, 210, 0.08)', // Adjust color as needed
                  '&:hover': {
                    backgroundColor: 'rgba(25, 118, 210, 0.15)', // Adjust color as needed
                  },
                },
              }}
            >
              <ListItemText primary={text} />
            </ListItemButton>
          ))}
        </List>
      </Box>
    </Drawer>
  );
}
