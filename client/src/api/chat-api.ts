import axios from "./instance"
import { ChatData, TextMessageData } from "@shared/Chat"

export async function getChatData(uid: string){
    const res = await axios.get("/api/chat/"+uid)
    return <ApiResponse<ChatData>>res.data;
}

export async function getMessages(uid: string, count: number = 1){
    const res = await axios.get("/api/chat/"+uid+"/messages?page="+count)
    return <ApiResponse<TextMessageData[]>>res.data;
}