import { useState, useEffect } from "react";
import axios from "axios";
import { AiOutlineSound } from "react-icons/ai";
import "./audio.css";

export default function Audio( {audioData} ) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [audioURL, setAudioURL] = useState(null);
    const [audioElement, setAudioElement] = useState(null);

    useEffect(() => {
        if (!audioURL && !isPlaying) {
            if ( audioData.role == 'robot' )
                handlePlay()
        }

    }, [audioURL, isPlaying]);

    const playAudio = async () => {
        try {
            const response = await axios.post("http://localhost:5000/api/audio/pt-PT", {
                data: audioData.content
            }, { responseType: "blob" });

            const audioBlob = new Blob([response.data]);
            const url = URL.createObjectURL(audioBlob);
            setAudioURL(url);
            setIsPlaying(true);
        } catch (error) {
            console.error("Erro ao carregar o arquivo de áudio:", error);
        }
    };

    const handlePlay = () => {
        if (!audioURL) {
            playAudio();
        } else {
            // audioElement.pause();
            setIsPlaying(!isPlaying);
            
            if (audioElement) {
                if (isPlaying) {
                    audioElement.pause();
                } else {
                    audioElement.play();
                }
            }
        }
    };

    const handleAudioLoaded = (audio) => {
        setAudioElement(audio);
    };

    return (
        <div data-slot="audio-control">
            <AiOutlineSound
                size={28}
                color={isPlaying ? "#00FF00" : "#c1c0c0b0"} // Altera a cor do ícone de som com base no estado de reprodução
                className="sound"
                onClick={handlePlay}
            />

            {audioURL && (
                <audio autoPlay={isPlaying} onLoadedMetadata={(e) => handleAudioLoaded(e.target)}>
                    <source src={audioURL} type="audio/wav" />
                </audio>
            )}

        </div>
    );
}
