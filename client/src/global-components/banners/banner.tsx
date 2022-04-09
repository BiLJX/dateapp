import { TextMessageData } from "@shared/Chat"
import { FC } from "react"
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

export const BannerContent: FC<{sender_name: string, text: string, to: string, type: 1|2}> = ({sender_name, text, to, type}) => {
    if(type === 2) {
        return(
            <NavLink to = {to} style = {{display: "flex", flexDirection: "column"}}>
                <span className="banner-username">{sender_name}<span className="banner-message ellipsis" style={{marginLeft: "5px"}}>{text}</span></span>
            </NavLink>
        )
    }
    return (
        <NavLink to = {to} style = {{display: "flex", flexDirection: "column"}}>
            <span className="banner-username">{sender_name}</span>
            <span className="banner-message ellipsis">{text}</span>
        </NavLink>
    )
}

export const BannerPfpIcon: FC<{pfp: string, to: string}> = (props)=>{
    return(
        <NavLink to = {props.to} style={{borderRadius: "100%", width: "50px", height: "50px", overflow: "hidden" }}>
            <img className="full-img" src={props.pfp}/>
        </NavLink>
    )
}