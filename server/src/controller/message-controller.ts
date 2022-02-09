import JSONRESPONSE from "../utils/JSONReponse";
import { Request, Response } from "express";
import { UserDate } from "../models/Dates";
import { UserInterface } from "@shared/User";
import { ChatData } from "@shared/Chat"
import MessageModel from "../models/Message";

export async function getChatData(req: Request, res: Response){
    const JSONReponse = new JSONRESPONSE(res);
    const date_user_uid = req.params.uid;
    const currentUser: UserInterface = req.app.locals.currentUser
    try {
        const date = (await UserDate.findOne({uid: currentUser.uid, date_user_uid: date_user_uid}).populate("date_user_data", "uid full_name profile_picture_url username").exec())?.toJSON();
        const has_seen = (await UserDate.findOne({uid: date_user_uid, date_user_uid: currentUser.uid}))?.toJSON().has_read_message
        if(!date) return JSONReponse.notFound();
        const response_data: ChatData = {
            has_seen: has_seen||false,
            chat_background: date.date_user_data.profile_picture_url,
            user_data: {
                username: date.date_user_data.username,
                full_name: date.date_user_data.full_name,
                profile_pic_url: date.date_user_data.profile_picture_url
            }
        }
        JSONReponse.success("success",response_data)
    } catch (error) {
        console.log(error)
        JSONReponse.serverError()
    }
}


export async function getMessages(req: Request, res: Response){
    const JSONReponse = new JSONRESPONSE(res);
    const receiver_uid = req.params.uid;
    const currentUser: UserInterface = req.app.locals.currentUser;
    const page_raw = <string>req.query.page||"0";
    const page = parseInt(page_raw) && parseInt(page_raw) * 10;
    if(!page || page<10) return JSONReponse.clientError("page not provided or page is less than 10")
    try {
        
        const find_query = { $or: [ { sender_uid: currentUser.uid, receiver_uid}, { sender_uid: receiver_uid, receiver_uid: currentUser.uid } ] }
        const messages_raw = await MessageModel
                                    .find(find_query)
                                    .sort({createdAt: 'desc'})
                                    .skip(page-10)
                                    .limit(10)
                                    .lean()
                                    .exec();
        const messages = messages_raw.reverse().map(x=>{
            const data: any = x;
            data.is_sent_by_viewer = data.sender_uid === currentUser.uid
            data.has_been_sent = true;
            return data;
        })
        JSONReponse.success("got messages",messages);
        if(page === 10) await UserDate.findOneAndUpdate({uid: currentUser.uid, date_user_uid: receiver_uid }, { $set: { has_read_message: true } }); 
    }catch(err){
        console.log(err)
        JSONReponse.serverError()
    }
}