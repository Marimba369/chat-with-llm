import "./header.css"
import { HiChatBubbleBottomCenterText } from "react-icons/hi2";

export default function Header (){
    return(
        <div className="logo">
            <HiChatBubbleBottomCenterText size={40} color="white"/>
            <p>Athena</p>
        </div>
    )
}