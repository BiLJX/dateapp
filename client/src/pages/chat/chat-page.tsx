import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { ChatData, TextMessageData } from '@shared/Chat';
import { getChatData } from 'api/chat-api';
import { Header } from 'global-components/containers/container-with-header';
import { Fragment, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChatItem, CurrentUserChatItem } from './chat-item';
import SendIcon from '@mui/icons-material/Send';
import "./chat-page.css"
export default function ChatPage(props: any){
    const { uid } = useParams()
    const [data, setData] = useState<ChatData>()
    const [messages, setMessages] = useState<TextMessageData[]>([])
    const main = useRef<HTMLDivElement>(null)
    const fetchData = async () => {
        if(!uid) return;
        const data = await getChatData(uid.trim());
        if(data.success){
            setData(data.data)
        }
    }
    const sendMessage = (text: string) => {
        const message: TextMessageData = {
            id: "0",
            is_sent_by_viewer: true,
            receiver_uid: uid||"",
            sender_uid: "",
            text,
            type: "TEXT"
        }
        setMessages((prev_state)=>[...prev_state, message])
    }
    useEffect(()=>{
        main.current?.scrollTo(0, main.current.scrollHeight)
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
                <div className='chat-page-messages' ref = {main} style={ { backgroundImage: `linear-gradient(180deg,rgba(18, 16, 21, 0.79) 0%,#121015 76.91%), url('${data.chat_background}')` } }>
                    <div className='chat-page-message-container'>
                       {
                           messages.map((x, i)=>(
                               <Fragment key = {i}>
                                   { x.is_sent_by_viewer?<CurrentUserChatItem message_obj={x} />:<ChatItem message_obj={x} user_data={ data.user_data } /> }
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