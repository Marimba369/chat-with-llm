//import TextInput from "../TextInput/TextInput"
import Chat from "../chat/Chat"
import "./assistant.css"
import { ChatProvider } from "../../../ChatContext"

export default function Assistant() {
    return (
        <div className="wrap">
            <div className="main-container">
                <ChatProvider>
                    <Chat />
                </ChatProvider>
            </div>
        </div>

    )
}
