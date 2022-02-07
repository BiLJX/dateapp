import { TextMessageData, TextMessageSocketData } from "@shared/Chat";
import { Socket } from "socket.io";
import { uuid } from "../utils/idgen";
import { getUid, getUser } from "../utils/uid";
import { ActiveUsers, ActiveUsersInterface } from "./ActiveUsers";
import cookie from "cookie"
import MessageModel from "../models/Message";
import { UserDate } from "../models/Dates";

async function updateDataBase(message_obj: TextMessageData){
    const message = new MessageModel(message_obj);
    await message.save();
    await UserDate.findOneAndUpdate({uid: message_obj.sender_uid, date_user_uid: message_obj.receiver_uid}, { $set: { latest_message: message_obj.text  } });
    await UserDate.findOneAndUpdate({uid: message_obj.receiver_uid, date_user_uid: message_obj.sender_uid}, { $set: { latest_message: message_obj.text  } });
}

export class Chat {
    constructor(private activeUsers: ActiveUsers){}
    public dmMessage(socket: Socket){
        socket.on("message", async (message_obj: TextMessageSocketData)=>{
            try {
                    //getting uid
                const cookief = socket.handshake.headers.cookie||"";
                const cookies = cookie.parse(cookief) 
                const token = <string>socket.handshake.query.session || cookies.session || "";
                const sender_uid = getUid(token);

                //getting client data
                const { text, type, receiver_uid } = message_obj;
                const receiver_user = await getUser(receiver_uid);

                //validating
                if(!sender_uid) return;
                if(!receiver_user) return;

                //getting active user
                const receiver_socketId: string|undefined = this.activeUsers.getUserByUid(receiver_uid);
                
                //making data
                const message_data: TextMessageData = {
                    message_id: uuid(),
                    type,
                    text,
                    receiver_uid,
                    sender_uid,
                    is_sent_by_viewer: false,
                }

                //send if user is active
                await updateDataBase(message_data);
                if(receiver_socketId){
                    socket.to(receiver_socketId).emit("message", message_data)
                }
                socket.emit("sent", { ...message_data, is_sent_by_viewer: true })
            } catch (error) {
                console.log(error)
            }
            
        })
    }
    public updateActiveUsers(activeUsers: ActiveUsers){
        this.activeUsers = activeUsers;
    }
}