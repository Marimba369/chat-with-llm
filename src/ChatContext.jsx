import { createContext, useContext, useState } from 'react';
import axios from 'axios';

const ChatContext = createContext();

export const useChat = () => {
  return useContext(ChatContext);
};

export const ChatProvider = ( {children} ) => {
  const [messages, setMessages] = useState([
    { role: 'robot', content: 'Olá, Como posso ajudar hoje?' },
  ]);

  const [inputValue, setInputValue] = useState('');

  const sendMessage = async (messageContent) => {
    if (messageContent.trim() === '') return;

    try {
      const newUserMessage = { role: 'user', content: messageContent };
      const newMessages = [...messages, newUserMessage];
      setMessages(newMessages);
      setInputValue('');

      const response = await axios.post('http://127.0.0.1:5000/api/generate/', {
        request: messageContent,
        model: 'Athena:latest',
      });

      const reply = response.data.data;
      const newBotMessage = { role: 'robot', content: reply };
      setMessages([...newMessages, newBotMessage]);
    } catch (error) {
      console.error('Error: ', error);
      const errorMessage = {
        role: 'robot',
        content: 'Ups! Algo correu mal. Por favor tente novamente.',
      };
      setMessages([...messages, errorMessage]);
    }
  };

  const sendAudioMessage = async (audioBlob) => {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'audio.webm');
    try {
      const response = await axios.post('http://127.0.0.1:5000/api/sst/pt-PT', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const text = response.data.data;
      await sendMessage(text);
    } catch (error) {
      console.error('Error: ', error);
      const errorMessage = {
        role: 'robot',
        content: 'Ups! Algo correu mal ao enviar o áudio. Por favor tente novamente.',
      };
      setMessages([...messages, errorMessage]);
    }
  };

  return (
    <ChatContext.Provider value={{ messages, inputValue, setInputValue, sendMessage, sendAudioMessage }}>
      {children}
    </ChatContext.Provider>
  );
};
