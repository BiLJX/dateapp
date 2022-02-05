import axios from "./instance"
import { ChatData } from "@shared/Chat"

export async function getChatData(uid: string){
    const res = await axios.get("/api/chat/"+uid)
    return <ApiResponse<ChatData>>res.data;
}