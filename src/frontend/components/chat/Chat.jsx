import "./chat.css";
import { HiChatBubbleBottomCenterText } from "react-icons/hi2";
import { FaRegArrowAltCircleUp, FaUserCheck } from "react-icons/fa";
import Audio from "../audio/Audio";
import GravadorSom from "../audio/GravadorSom";
import { useChat } from "../../../ChatContext";

export default function Chat() {
  const { messages, inputValue, setInputValue, sendMessage } = useChat(); // Usando o contexto

  return (
    <div className="chat-container">
      <ul className="chatbox">
        {messages.map((message, index) => (
          <li
            key={`message-${index}`}
            className={`chat incoming ${message.role}`}
          >
            {message.role === "robot" && (
              <div className="profile">
                <HiChatBubbleBottomCenterText size={40} color="#346449" className="ai"/>
                <h3>Athena</h3>
              </div>
            )}
            
            {message.role === "user" && (
              <div className="profile">
                <FaUserCheck size={40} color="#c1c0c0b0" className="user"/>
                <h3>User</h3>
              </div>
            )}
            <p className={`message ${message.role}`}>{message.content}</p>
            <Audio audioData={message} />
          </li>
        ))}
      </ul>

      <div className="input" >
        <textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Digite sua mensagem..."
          spellCheck={false}
          required
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage(inputValue);
            }
          }}
        ></textarea>
        <FaRegArrowAltCircleUp size={55} className="arrow init" onClick={() => sendMessage(inputValue)} />
        <GravadorSom className="recorder init" />
      </div>
    </div>
  );
}
