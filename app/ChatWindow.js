import { useState } from 'react';
import MinecraftItem3D from './MinecraftItem3D';

export default function ChatWindow() {
  const [selectedBot, setSelectedBot] = useState('coding'); // Example state for bot type

  return (
    <div style={{ display: 'flex' }}>
      <div id="chat-container" style={{ width: '70%' }}>
        {/* Your chat UI here */}
      </div>
      <MinecraftItem3D item={selectedBot} />
    </div>
  );
}
