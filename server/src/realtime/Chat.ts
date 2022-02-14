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
    await UserDate.findOneAndUpdate({uid: message_obj.sender_uid, date_user_uid: message_obj.receiver_uid}, { $set: { latest_message: message_obj.text, has_read_message: true  } });
    await UserDate.findOneAndUpdate({uid: message_obj.receiver_uid, date_user_uid: message_obj.sender_uid}, { $set: { latest_message: message_obj.text, has_read_message: false  } });
}

export class Chat {
    constructor(private activeUsers: ActiveUsers){}
    public dmMessage(socket: Socket){
        //getting uid
        const cookief = socket.handshake.headers.cookie||"";
        const cookies = cookie.parse(cookief) 
        const token = <string>socket.handshake.query.session || cookies.session || "";
        const sender_uid = getUid(token);
        socket.on("message", async (message_obj: TextMessageSocketData)=>{
            try {
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
                    socket.to(receiver_socketId).emit("message", message_data);
                }
                socket.emit("sent", { ...message_data, is_sent_by_viewer: true });
                
            } catch (error) {
                console.log(error)
            }
        })
        //seen
        socket.on("seen", async (uid)=>{
           try {
               await UserDate.findOneAndUpdate({ uid: sender_uid, date_user_uid: uid  }, { $set: { has_read_message: true } });
               const receiver_socketId: string|undefined = this.activeUsers.getUserByUid(uid);
               if(receiver_socketId) socket.to(receiver_socketId).emit("seen", sender_uid);
           } catch (error) {
               console.log(error)
           }
        })
        //typing
        socket.on("typing", data=>{
            try{
                const receiver_socketId: string|undefined = this.activeUsers.getUserByUid(data.receiver_uid);
                if(receiver_socketId) socket.to(receiver_socketId).emit("typing", { state: data.state, sender_uid });
            }catch(err){
                console.log(err)
            }
        })

    }
    public updateActiveUsers(activeUsers: ActiveUsers){
        this.activeUsers = activeUsers;
    }
}