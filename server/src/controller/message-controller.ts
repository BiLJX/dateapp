import JSONRESPONSE from "../utils/JSONReponse";
import { Request, Response } from "express";
import { UserDate } from "../models/Dates";
import { UserInterface } from "@shared/User";
import { ChatData } from "@shared/Chat"

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