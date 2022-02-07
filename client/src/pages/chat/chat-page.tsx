import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { ChatData, TextMessageData } from '@shared/Chat';
import { getChatData, getMessages } from 'api/chat-api';
import { Header } from 'global-components/containers/container-with-header';
import React, { Fragment, useContext, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChatItem, CurrentUserChatItem } from './chat-item';
import SendIcon from '@mui/icons-material/Send';
import "./chat-page.css"
import { chatContext } from 'context/Realtime';
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
    const main = useRef<HTMLDivElement>(null);
    const chat = useContext(chatContext)
    const scrollDown = () => main.current?.scrollTo(0, main.current.scrollHeight);
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
            scrollDown()
        })
    }

    const getChatMessages = async (count: number = 1) => {
        if(!uid) return;
        const response = await getMessages(uid, count)
        if(response.success){
            if(response.data.length !== 0) return setMessages((prev_state) => [...response.data.reverse(), ...prev_state]);
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
                }
            })
        }
        return(()=>{
            chat?.offMessage()
        })
    }, [chat])

    useEffect(()=>{
        scrollDown()
    }, [main, data])

    useEffect(()=>{   
        if(!uid) return;
        fetchData()
    }, [uid])

    if(!data) return <Header name = "Chat" goBackButton />
    return(
        <div className = "chat-page">
            <ChatHeader data= {data} />
            <section>
                <div className='chat-page-messages' onScroll={handleScroll} ref = {main} style={ { backgroundImage: `linear-gradient(180deg,rgba(18, 16, 21, 0.79) 0%,#121015 76.91%), url('${data.chat_background}')` } }>
                    <div className='chat-page-message-container'>
                       {
                           messages.map((x, i)=>(
                               <Fragment key = {i}>
                                   { x.is_sent_by_viewer?<CurrentUserChatItem message_obj={x as ViewerTextMessageData} />:<ChatItem message_obj={x} user_data={ data.user_data } /> }
                               </Fragment>
                           ))
                       }
                    </div>
                </div>
            </section>
            
           <Input send = {sendMessage} />
        </div>           
    )
}

function ChatHeader({data}: {data: ChatData}){
    const navigate = useNavigate()
    return(
        <header className="chat-page-header">
            <div className = "chat-page-header-back" onClick={()=>navigate(-1)}>
                <ArrowBackIosIcon />
            </div>
            <div className = "chat-page-header-pfp-container">
                <div className='chat-page-header-pfp'>
                    <img className='full-img' src = {data.user_data.profile_pic_url} />
                </div>
            </div>
            <div className = "chat-page-header-info-container">
                <h2 className='chat-page-header-name ellipsis'>{data.user_data.full_name}</h2>
                <span className = "chat-page-header-username">{data.user_data.username}</span>
            </div>
        </header>
    )
}

function Input({send}: {send: (text: string)=>any}){
    const [text, setText] = useState("");
    const container_ref = useRef<any>(null)
    function handleKeyDown(e:any){
        e.target.style.height = '44px';
        e.target.style.height = e.target.scrollHeight  + "px";
    }
    function submit(){
        if(!text) return;
        const msg = text.trim()
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