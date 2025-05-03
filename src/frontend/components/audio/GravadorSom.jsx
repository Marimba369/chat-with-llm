import React, { useState, useRef, useEffect } from 'react';
import { AiOutlineAudio } from "react-icons/ai";
import "../chat/chat.css";
import { useChat } from '../../../ChatContext'; // Importando o contexto

const GravadorSom = () => {
  const { sendAudioMessage } = useChat(); // Usando o contexto
  const [recording, setRecording] = useState(false);
  const [audioChunks, setAudioChunks] = useState([]);
  const mediaRecorderRef = useRef(null);
  const audioStreamRef = useRef(null);

  useEffect(() => {
    if (!recording && audioChunks.length > 0) {
      const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
      sendAudioMessage(audioBlob); // Enviando a mensagem de áudio
      setAudioChunks([]);
    }
  }, [recording, audioChunks, sendAudioMessage]);

  const startRecording = async () => {
    try {
      const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioStreamRef.current = audioStream;
      const mediaRecorder = new MediaRecorder(audioStream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.addEventListener('dataavailable', event => {
        if (event.data.size > 0) {
          setAudioChunks(prev => [...prev, event.data]);
        }
      });

      mediaRecorder.start();
      setRecording(true);
    } catch (error) {
      console.error('Erro ao acessar o microfone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && audioStreamRef.current) {
      mediaRecorderRef.current.stop();
      audioStreamRef.current.getTracks().forEach(track => track.stop());
      setRecording(false);
    }
  };

  const toggleRecording = () => {
    if (recording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <div dataSlot="audio-control">
      <AiOutlineAudio
        onClick={toggleRecording}
        color={recording ? "red" : "#c1c0c0b0"}
        size={55}
        className="recorder init"
      />
    </div>
  );
};

export default GravadorSom;
