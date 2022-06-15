import { TextMessageData, TextMessageSocketData } from "@shared/Chat";
import { Socket } from "socket.io-client";
import Cookies from "js-cookie"

export interface ViewerTextMessageData extends TextMessageData {
    has_been_sent: boolean;
}


class QuickChat {
    constructor(private socket: Socket){};
    public onMessage(message_cb: (message_obj: TextMessageData)=>any){
        const socket = this.socket;
        socket.on("quick-message", message_cb)
    }
    public offMessage(){
        const socket = this.socket;
        socket.off("quick-message")
    }
    public sendTextMessage(to_uid: string, text: string, sent_cb: (data: ViewerTextMessageData)=>any){
        const socket = this.socket;
        const data: TextMessageSocketData = {
            text,
            type: "TEXT",
            receiver_uid: to_uid
        }
        socket.emit("quick-message", data);
        socket.on("quick-sent", (data: ViewerTextMessageData)=>{
            data.has_been_sent = true
            sent_cb(data)
            socket.off("quick-sent")
        });
    }
    public seen(uid: string){
        const socket = this.socket;
        socket.emit("quick-seen", uid);
    }
    public onSeen(cb: (seen_by: string)=>any){
        const socket = this.socket;
        socket.on("quick-seen", cb)
    }
    public offSeen(){
        const socket = this.socket;
        socket.off("quick-seen")
    }
    public sendTyping(uid: string, state: boolean){
        const socket = this.socket;
        socket.emit("quick-typing", {
            receiver_uid: uid,
            state
        });
    }
    public isTyping(cb: (data: { sender_uid: string, state: boolean })=>any){
        const socket = this.socket;
        socket.on("quick-typing", cb);
    }
}


export default class Chat {
    constructor(private socket: Socket){};
    public onMessage(message_cb: (message_obj: TextMessageData)=>any){
        const socket = this.socket;
        socket.on("message", message_cb)
    }
    public offMessage(){
        const socket = this.socket;
        socket.off("message")
    }
    public sendTextMessage(to_uid: string, text: string, sent_cb: (data: ViewerTextMessageData)=>any){
        const socket = this.socket;
        const data: TextMessageSocketData = {
            text,
            type: "TEXT",
            receiver_uid: to_uid
        }
        socket.emit("message", data);
        socket.on("sent", (data: ViewerTextMessageData)=>{
            data.has_been_sent = true
            sent_cb(data)
            socket.off("sent")
        });
    }
    public seen(uid: string){
        const socket = this.socket;
        socket.emit("seen", uid);
    }
    public onSeen(cb: (seen_by: string)=>any){
        const socket = this.socket;
        socket.on("seen", cb)
    }
    public offSeen(){
        const socket = this.socket;
        socket.off("seen")
    }
    public sendTyping(uid: string, state: boolean){
        const socket = this.socket;
        socket.emit("typing", {
            receiver_uid: uid,
            state
        });
    }
    public isTyping(cb: (data: { sender_uid: string, state: boolean })=>any){
        const socket = this.socket;
        socket.on("typing", cb);
    }
    get QuickChat(){
        return new QuickChat(this.socket);
    }
}

