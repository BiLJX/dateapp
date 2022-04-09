import { NotificationInterface } from "@shared/Notify";
import { UserInterface } from "@shared/User";
import { Request, Response } from "express";
import { DateRequest } from "../models/DateRequest";
import { UserDate } from "../models/Dates";
import { User } from "../models/User";
import { ActiveUsers } from "../realtime/ActiveUsers";
import Notification from "../realtime/Notify";
import JSONRESPONSE from "../utils/JSONReponse";
import { parseUser } from "./user-controller";

async function acceptUser(request_sent_by: string, request_sent_to: string){
    await DateRequest.findOneAndDelete({request_sent_by, request_sent_to});
    await User.findOneAndUpdate({uid:request_sent_by}, {$push: { dates: request_sent_to }})
    await User.findOneAndUpdate({uid:request_sent_to}, {$push: { dates: request_sent_by }})
    const userDate1 = new UserDate({
        uid: request_sent_by,
        date_user_uid: request_sent_to,
    })
    const userDate2 = new UserDate({
        uid: request_sent_to,
        date_user_uid: request_sent_by,
    })
    await Promise.allSettled([userDate1.save(), userDate2.save()]);
}


export async function getUserDates(req: Request, res: Response){
    const JSONReponse = new JSONRESPONSE(res)
    const uid = res.locals.uid;
    const active_user_obj: ActiveUsers = req.app.locals.active_user_obj; 
    const active_users = active_user_obj.active_users
    try{
        const dates_raw = await UserDate.find({uid}).sort({updatedAt: "desc"}).populate("date_user_data", "uid full_name profile_picture_url").sort({createdAt: 'desc'}).lean().exec()
        const dates = dates_raw.map(x=>{
            x.is_active = active_users.includes(x.date_user_uid);
            return x;
        })
        JSONReponse.success("success",dates)
    }catch(err){
        console.log(err)
        JSONReponse.serverError()
    }
}

export const getRequestDate = async (req: Request, res: Response) => {
    const JSONReponse = new JSONRESPONSE(res)
    const uid = res.locals.uid;
    try{
        const requests = await DateRequest.find({request_sent_to: uid})
        const uids = requests.map(x=>x.request_sent_by);
        const users = await User.find({uid: { $in: uids }}).select({ account_setuped: 0, is_admin: 0, email: 0 }).exec();
        const parsed_users = await Promise.all(users.map(async x=>parseUser(x.toJSON(), res.locals.currentUser))) 
        JSONReponse.success("successfully got users", parsed_users)
    }catch(err){
        console.log(err)
        JSONReponse.serverError()
    }
}

export const pendingRequests = async (req: Request, res: Response) => {
    const JSONReponse = new JSONRESPONSE(res)
    const uid = res.locals.uid;
    try{
        const requests = await DateRequest.find({request_sent_by: uid})
        const uids = requests.map(x=>x.request_sent_to);
        const users = await User.find({uid: { $in: uids }}).select({ account_setuped: 0, is_admin: 0, email: 0 }).exec();
        const parsed_users = await Promise.all(users.map(async x=>parseUser(x.toJSON(), res.locals.currentUser))) 
        JSONReponse.success("successfully got users", parsed_users)
    }catch(err){
        console.log(err)
        JSONReponse.serverError()
    }
}

export const requestDate = async (req: Request, res: Response)=>{
    const JSONReponse = new JSONRESPONSE(res)
    const request_sent_to = req.params.uid;
    const request_sent_by = res.locals.uid;
    const current_user: UserInterface = res.locals.currentUser;
    const notification: Notification = req.app.locals.notification;
    try{
        if(current_user.dates.includes(request_sent_to)) return JSONReponse.clientError("already dating")
        const hasUserSentBefore = (await DateRequest.findOne({request_sent_to, request_sent_by}))?.toJSON()
        if(request_sent_to === request_sent_by) return JSONReponse.clientError("you have cannot send to yourself")
        if(hasUserSentBefore) return JSONReponse.clientError("you have already requested")
        const user = User.findOne({uid: request_sent_to})
        //checking if sent to user had sent request
        const hasSentTo_UserSentBefore = (await DateRequest.findOne({request_sent_to: request_sent_by, request_sent_by: request_sent_to}))?.toJSON()
        if(hasSentTo_UserSentBefore){
            await acceptUser(request_sent_to, request_sent_by)
            return JSONReponse.success("You guys are a match!")
        }
       
        if(!user) return JSONReponse.notFound("user not found");
        const dateRequest = new DateRequest({request_sent_to, request_sent_by});
        await dateRequest.save();
        JSONReponse.success("date request sent");
        const notification_data: NotificationInterface = {
            type: "DATE_REQUEST",
            has_read: false,
            text: "sent you date request",
            sender: current_user.uid,
            receiver: request_sent_to,
            content: null,
            sender_data: {
                name: current_user.username,
                profile_picture_url: current_user.profile_picture_url,
                uid: current_user.uid
            }
        }
        notification.dateRequest(notification_data);
    }catch(err){
        console.log(err)
        JSONReponse.serverError()
    }
}

//cancel request
export const cancelDateRequest = async (req: Request, res: Response) => {
    const JSONReponse = new JSONRESPONSE(res)
    const request_sent_to = req.params.uid;
    const request_sent_by = res.locals.uid;
    try{
        await DateRequest.findOneAndDelete({request_sent_to, request_sent_by});
        JSONReponse.success("date request canceled")
    }catch(err){
        console.log(err)
        JSONReponse.serverError()
    }
}



//accept request

export const acceptDate = async (req:  Request, res: Response) => {
    const JSONReponse = new JSONRESPONSE(res);
    const currentUser: UserInterface = res.locals.currentUser;
    const uid = req.params.uid;
    try {
        if(!uid) return JSONReponse.clientError("something went wrong");
        const date_req = await DateRequest.findOne({ request_sent_by:uid, request_sent_to: currentUser.uid });
        if(!date_req) return JSONReponse.clientError("user has not send request")
        await acceptUser(uid, currentUser.uid);
        JSONReponse.success("accepted date")
    } catch (error) {
        console.log(error)
        JSONReponse.serverError()
    }
}

//reject reqest

export const rejectDate = async (req: Request, res: Response) => {
    const JSONReponse = new JSONRESPONSE(res);
    const currentUser: UserInterface = res.locals.currentUser;
    const uid = req.params.uid;
    try{
        await DateRequest.findOneAndDelete({request_sent_by: uid, request_sent_to: currentUser.uid});
        JSONReponse.success()
    }catch(error){
        console.log(error)
        JSONReponse.serverError()
    }
}

//undate

export const unDate = async (req: Request, res: Response) => {
    const JSONReponse = new JSONRESPONSE(res);
    const currentUser: UserInterface = res.locals.currentUser;
    const uid = req.params.uid;
    if(!currentUser.dates.includes(uid)) return JSONReponse.clientError("the user does not include in your dates")
    try{
        const task1 = User.findOneAndUpdate({uid}, { $pull: { dates: currentUser.uid } });
        const task2 = User.findOneAndUpdate({uid: currentUser.uid}, { $pull: { dates: uid } });
        const task3 = UserDate.deleteMany({uid, date_user_uid: currentUser.uid })
        const task4 = UserDate.deleteMany({uid: currentUser.uid, date_user_uid: uid})
        await Promise.allSettled([task1, task2, task3, task4])
        JSONReponse.success("removed from date");
    } catch (error){
        console.log(error)
        JSONReponse.serverError()
    }
} 


