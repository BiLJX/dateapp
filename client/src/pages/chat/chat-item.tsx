import { ChatData, TextMessageData } from "@shared/Chat"
import { ViewerTextMessageData } from "realtime/Chat"
import { JsxChild } from "typescript"

export function ChatItem({message_obj, user_data}: {message_obj: TextMessageData, user_data: ChatData["user_data"] }){
    return(
        <article className = "chat-item">
            <div className = "chat-item-left">
                <div className='chat-item-pfp'>
                    <img className='full-img' src = {user_data.profile_pic_url} />
                </div>
            </div>
            <div className="chat-item-right">
                <div className = "chat-message-container chat-message-container-left">
                    {message_obj.text}
                </div>
            </div>
        </article>
    )
}

export function CurrentUserChatItem({message_obj, has_seen}: {message_obj: ViewerTextMessageData, has_seen: boolean }){
    if(message_obj.has_been_sent){
        return(
            <article className = "chat-item">
                <div style = {{display: "flex", flexDirection: "column", marginLeft: "auto", maxWidth: "80%"}} >
                    <div className = "chat-message-container chat-message-container-right">
                        {message_obj.text}
                    </div>
                    {has_seen && <span style = {{paddingLeft: "1em", color: "var(--text-secondary)"}}>seen</span>}
                </div>
            </article>
        )
    }
    return(
        <article className = "chat-item">
            <div style={{marginLeft: "auto"}} className = "chat-message-container chat-message-container-right">
                {message_obj.text}
            </div>
            <span className = "sending"/>
        </article>
    )
}

