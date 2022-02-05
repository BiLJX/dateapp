import { ChatData, TextMessageData } from "@shared/Chat"
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

export function CurrentUserChatItem({message_obj}: {message_obj: TextMessageData }){
    return(
        <article className = "chat-item">
            <div className = "chat-message-container chat-message-container-right">
                {message_obj.text}
            </div>
        </article>
    )
}

