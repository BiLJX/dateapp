import { CurrentUserProfile, UserEditClientData, UserInterface, UserProfile } from "@shared/User";
import { Request, Response } from "express";
import moment from "moment";
import { DateRequest } from "../models/DateRequest";
import { User } from "../models/User";
import JSONRESPONSE from "../utils/JSONReponse";
import { upload, uploadFile } from "../utils/upload";
import { isDescription, isFullName, isUserName } from "../utils/validator";

//util

export async function parseUser(_user: any, current_user:UserInterface): Promise<UserProfile>{
    if(!_user) return _user;
    const user: UserProfile = _user
    const now = moment(new Date());
    const birthday = moment(_user.birthday);
    const years = moment.duration(now.diff(birthday)).asYears();
    const has_current_sent_date_request = await DateRequest.findOne({request_sent_by: current_user.uid, request_sent_to: user.uid});
    const has_this_user_sent_date_request = await DateRequest.findOne({request_sent_by: user.uid, request_sent_to: current_user.uid});
    user.age = Math.floor(years);
    user.is_dating = user.dates.includes(current_user.uid);
    user.has_saved = current_user.saved_users.includes(user.uid);
    user.has_current_sent_date_request = has_current_sent_date_request?true:false
    user.has_this_user_sent_date_request = has_this_user_sent_date_request?true:false
    return user
}

export async function parseCurrentUser(_current_user: UserInterface|undefined){
    if(!_current_user) return;
    const user = <CurrentUserProfile>_current_user
    const now = moment(new Date());
    const birthday = moment(_current_user.birthday);
    const years = moment.duration(now.diff(birthday)).asYears();
    const date_requests = (await DateRequest.find({request_sent_to: user.uid}));
    user.age = years;
    user.library = {
        has_date_requests: date_requests.length > 0,
        date_requests_count: date_requests.length,
        has_notifications: false,
        notifications_count: 0
    }
    return user
}

//get users

export async function getUsers(req: Request, res: Response){
    const JSONReponse = new JSONRESPONSE(res)
    const uid = res.locals.uid
    try{
        const page: number = parseInt(<string>req.query.page)||1;
        if(page<1) return JSONReponse.clientError("page cannot be leses than 1");
        const items: number = 5;
        const total_items = page * items;
        const users = await User
                            .find({account_setuped: true, uid: { $ne: uid }})
                            .sort({updatedAt: 'desc'})
                            .skip(total_items-items)
                            .limit(items)
                            .exec()
        const parsed_users: UserProfile[] = await Promise.all(users.map(async x=>parseUser(x.toJSON(), res.locals.currentUser))) 
        JSONReponse.success("success", parsed_users)
    }catch(err){
        console.log(err)
        JSONReponse.serverError()
    }
}


//get current user

export async function getCurrentUser(req: Request, res: Response){
    const JSONReponse = new JSONRESPONSE(res)
    const user = res.locals.currentUser;
    JSONReponse.success("success", await parseCurrentUser(user?.toJSON()))
}



//get user by uid

export async function getUserByUid(req: Request, res: Response){
    const JSONReponse = new JSONRESPONSE(res)
    const uid = req.params.uid
    if(!uid) return JSONReponse.notFound("User Not Found :(")
    try{
        const user = await User.findOne({uid});
        JSONReponse.success("success", await parseUser(user?.toJSON(), res.locals.currentUser));
    }catch(err){
        console.log(err)
        JSONReponse.serverError()
    }
}

//edit user data

export async function editUserProfile(req: Request, res: Response){
    upload(req, res, async (err)=>{
        const JSONReponse = new JSONRESPONSE(res);
        const uid = res.locals.uid;
        const { full_name, username, description, gender }: UserEditClientData = req.body;
        const file: any = req.files
        const pfp = file[0]
        const current_user = <UserInterface>res.locals.currentUser
        try{
            //validation
            let url: string|undefined;
            if(!url && !current_user.account_setuped) return JSONReponse.clientError("You need to add a profile picture")
            if(!isUserName(username)) return JSONReponse.clientError("invalid username or username is less than 3 charecter");
            if(!isFullName(full_name)) return JSONReponse.clientError("invalid name");
            if(!isDescription(description)) return JSONReponse.clientError("description is less than 10 or more than 100 charecters")
            const splited_name = full_name.split(" ")
            const data = {
                full_name: full_name.trim(),
                username: username.trim().toLocaleLowerCase(),
                description: description.trim(),
                gender: gender.toLowerCase().trim(),
                account_setuped: true,
                first_name: splited_name[0]?.trim(),
                last_name: splited_name?.length > 2 ? splited_name[1]?.trim() + " " + splited_name[2]?.trim() : splited_name[1]?.trim()||"",
            }
            await User.findOneAndUpdate({uid}, {$set: data})
            const updatedUser = await User.findOne({uid})
            return JSONReponse.success("success", await parseCurrentUser(updatedUser?.toJSON()))
        }catch(err: any){
            console.log(err)
            JSONReponse.serverError()
        }
    })
}


//save user 

export const saveUser = async (req: Request, res: Response) => {
    const JSONReponse = new JSONRESPONSE(res);
    const currentUser: UserInterface = res.locals.currentUser;
    const uid = req.params.uid;
    if(currentUser.saved_users.includes(uid)) return JSONReponse.clientError("you have already saved");
    try{
        const hasUser = await User.findOne({uid});
        if(!hasUser) return JSONReponse.notFound("user not found");
        await User.findOneAndUpdate({uid: currentUser.uid}, { $push: { saved_users: uid } });
        JSONReponse.success("saved")
    }catch(err){
        console.log(err)
        JSONReponse.serverError()
    }
}

//unsave user

export const unsaveUser = async(req: Request, res: Response) => {
    const JSONReponse = new JSONRESPONSE(res);
    const currentUser: UserInterface = res.locals.currentUser;
    const uid = req.params.uid;
    try{
        if(!currentUser.saved_users.includes(uid)) return JSONReponse.clientError("you had not saved the user");
        await User.findOneAndUpdate({uid: currentUser.uid}, { $pull: { saved_users: uid } });
        JSONReponse.success("unsaved")
    }catch(err){
        console.log(err)
        JSONReponse.serverError()
    }
}


