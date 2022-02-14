import { TextMessageData } from "@shared/Chat"
import { NavLink } from "react-router-dom"
import "./banner.css"

export function Banner({msg, className}: {msg: string, className: string}){
    return(
        <article className={"banner "+className}>
            {msg}
        </article>
    )
}

export function TextMessageBanner({message_obj}:{message_obj: TextMessageData}){
    return(
        <NavLink to = {"/message/"+message_obj.sender_uid} className="banner text-message-banner">
            <div className = "banner-left">
                <div className="banner-left-pfp">
                    <img src={message_obj.author_data?.profile_pic_url} alt="pfp" className="full-img" />
                </div>
            </div>
            <div className="banner-right">
                <div className="banner-username ellipsis">
                    { message_obj.author_data?.username }
                </div>
                <div className="banner-message ellipsis">
                    { message_obj.text }
                </div>
            </div>
        </NavLink>
    )
}