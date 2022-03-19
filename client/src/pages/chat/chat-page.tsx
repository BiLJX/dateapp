import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { ChatData, TextMessageData } from '@shared/Chat';
import { getChatData, getMessages } from 'api/chat-api';
import { Header } from 'global-components/containers/container-with-header';
import React, { Fragment, useContext, useEffect, useRef, useState } from 'react';
import { NavLink, useNavigate, useParams } from 'react-router-dom';

import { ChatItem, CurrentUserChatItem } from './chat-item';
import SendIcon from '@mui/icons-material/Send';
import "./chat-page.css"
import { chatContext } from 'context/Realtime';
import { TailSpin } from "react-loader-spinner"
import { ViewerTextMessageData } from 'realtime/Chat';
function uuid(){
    return (Math.floor(Math.random() * Math.pow(10, 15))).toString(16)
}
export default function ChatPage(props: any){
    const { uid } = useParams()
    const [data, setData] = useState<ChatData>()
    const [messages, setMessages] = useState<TextMessageData[]|ViewerTextMessageData[]>([])
    const [counter, setCounter] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isTyping, setIsTyping] = useState(false)
    const main = useRef<HTMLDivElement>(null);
    const chat = useContext(chatContext)
    const scrollDown = (flag: boolean = false) => {
        if(!main.current) return;
        const ratio = main.current.scrollTop / main.current.scrollHeight;
        if(flag) return main.current.scrollTo(0, main.current.scrollHeight);
        if(ratio > 0.5) return main.current.scrollTo(0, main.current.scrollHeight);
        
    }
    const fetchData = async () => {
        if(!uid) return;
        const data = await getChatData(uid.trim());
        if(data.success){
            setData(data.data)
        }
    }
    const handleScroll = (e:React.UIEvent<HTMLElement>)=>{
        if(e.currentTarget.scrollTop === 0) {
            hasMore && getChatMessages(counter + 1)
            hasMore && setCounter(counter + 1);
        }
    }
    const sendMessage = (text: string) => {
        if(!uid) return;
        main.current?.scrollTo(0, main.current.scrollHeight);
        const message: TextMessageData = {
            message_id: uuid(),
            is_sent_by_viewer: true,
            receiver_uid: uid||"",
            sender_uid: "",
            text,
            type: "TEXT"
        }
        setMessages((prev_state)=>[...prev_state, message])
        chat?.sendTextMessage(uid, text, (data)=>{
            setMessages((prev_state)=>{
                const newArr = prev_state.filter((val)=>val.message_id !== message.message_id);
                return [...newArr, data]
            })
            setData((prev)=>(prev && {...prev, has_seen: false}))
        })
        
       
    }

    const getChatMessages = async (page: number = 1) => {
        if(!uid) return;
        const response = await getMessages(uid, page)
        if(response.success){
            if(response.data.length >= 10) {
                if(page === 1) chat?.seen(uid)
                setMessages((prev_state) => [...response.data, ...prev_state]);
                if(page > 1) main.current?.scrollTo(0, main.current.clientHeight)
                return
            }
            setMessages((prev_state) => [...response.data, ...prev_state]);
            setHasMore(false)
        }
    }

    useEffect(()=>{
        getChatMessages()
    }, [])

    useEffect(()=>{
        if(chat){
            chat.onMessage((message_obj)=>{
                if(message_obj.sender_uid === uid){
                    setMessages((prev_state)=>[...prev_state, message_obj])
                    scrollDown()
                    chat.seen(uid)
                }
            })
            chat.onSeen((seen_by)=>{
                if(seen_by === uid) setData((prev)=>(prev && {...prev, has_seen: true}))
            })
            chat.isTyping(data=>{
                if(data.sender_uid === uid) setIsTyping(data.state);
            })
            chat.seen(uid||"")
        }
        return(()=>{
            chat?.offMessage()
            chat?.offSeen()
        })
    }, [chat])

    useEffect(()=>{
        scrollDown(true)
    }, [main, data])

    useEffect(()=>{   
        if(!uid) return;
        fetchData()
    }, [uid])

    if(!data) return <Header name = "Chat" goBackButton />
    return(
        <div className = "chat-page">
            <ChatHeader data= {data} uid = {uid||""} />
            <section>
                <div className='chat-page-messages'  style={ { backgroundImage: `linear-gradient(180deg,rgba(18, 16, 21, 0.79) 0%, var(--background) 76.91%), url('${data.chat_background}')` } }>
                    <div onScroll={handleScroll} ref = {main} style={{display: "flex", maxHeight: "100%", flexDirection: "column", overflowY: "scroll", overflowX: "hidden"}}>
                        <div className='chat-page-message-container'>
                            {hasMore&&<div className='chat-page-messages-loader'><TailSpin height={30} width = {30} color = "var(--text-main2)"/></div>}
                            {
                            messages.map((x, i)=>(
                                <Fragment key = {i}>
                                    { x.is_sent_by_viewer?<CurrentUserChatItem message_obj={x as ViewerTextMessageData} has_seen = { messages[messages.length - 1]?.message_id === x.message_id && data.has_seen}  />:<ChatItem message_obj={x} user_data={ data.user_data } /> }
                                </Fragment>
                            ))
                            }
                            { isTyping&& <span style = {{color: "var(--text-main2)", marginLeft: "1rem", marginTop: "1rem"}}>typing...</span> }
                        </div>
                    </div>
                </div>
            </section>
            
           <Input send = {sendMessage} uid = {uid||""} />
        </div>          
    )
}

function ChatHeader({data, uid}: {data: ChatData, uid: string}){
    const navigate = useNavigate()
    return(
        <header className="chat-page-header">
            <div className = "chat-page-header-back" onClick={()=>navigate(-1)}>
                <ArrowBackIosIcon />
            </div>
            <NavLink to = {"/user/"+uid} className = "chat-page-header-pfp-container">
                <div className='chat-page-header-pfp'>
                    <img className='full-img' src = {data.user_data.profile_pic_url} />
                </div>
            </NavLink>
            <NavLink to = {"/user/"+uid} className = "chat-page-header-info-container">
                <h2 className='chat-page-header-name ellipsis'>{data.user_data.full_name}</h2>
                <span className = "chat-page-header-username">{data.user_data.username}</span>
            </NavLink>
        </header>
    )
}

function Input({send, uid}: {send: (text: string,)=>any, uid: string}){
    const [text, setText] = useState("");
    const [typing, setTyping] = useState(false);
    const [_timeout, set_Timeout] = useState<any>();
    const chat = useContext(chatContext)
    const container_ref = useRef<any>(null)
    const timeOutFunction = () => {
        console.log("not typing")
        setTyping(false)
        chat?.sendTyping(uid, false);
    }
    function handleKeyDown(e:any){
        e.target.style.height = '44px';
        e.target.style.height = e.target.scrollHeight  + "px";
        if(!typing){
            setTyping(true);
            chat?.sendTyping(uid, true);
            set_Timeout( setTimeout(timeOutFunction, 3000) );
        }else{
            clearTimeout(_timeout);
            set_Timeout( setTimeout(timeOutFunction, 3000) );
        }
    }
    function submit(){
        if(!text) return;
        const msg = text.trim()
        timeOutFunction()
        send(msg); 
        setText("");
        container_ref.current.style.height = '44px'
    }
    return(
        <footer className = "chat-page-footer">
            <div className = "chat-page-input-container">
                <textarea ref = {container_ref} placeholder='Message...' autoComplete='none' onKeyDown={handleKeyDown} onChange={(e: any)=>setText(e.target.value)} value = {text}/>
                <div className = "chat-page-input-button" onClick={submit}>
                    <SendIcon />
                </div>
            </div>
        </footer>
    )
}
