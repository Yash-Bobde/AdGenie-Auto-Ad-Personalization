//src/App.js
import React, { useState, useEffect } from 'react';
import HomeScreen from './screens/HomeScreen';
import SmileyScreen from './screens/SmileyScreen';
import socket from './socket';

const App = () => {
  const [message, setMessage] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Subscribe to new messages from socket
  useEffect(() => {
    const handleNewMessage = (newMessage) => {
      setMessage(newMessage);
    };

    socket.on('newMessage', handleNewMessage);

    // Cleanup on unmount
    return () => {
      socket.off('newMessage', handleNewMessage);
    };
  }, []);

  const handleSpeechEnd = () => {
    setMessage(null);
  };

  const renderScreen = () => {
    if (message) {
      return (
        <SmileyScreen
          isSpeaking={isSpeaking}
          setSpeaking={setIsSpeaking}
          message={message}
          onSpeechEnd={handleSpeechEnd}
        />
      );
    }

    return <HomeScreen />;
  };

  return (
    <div className="App">
      {renderScreen()}
    </div>
  );
};

export default App;
