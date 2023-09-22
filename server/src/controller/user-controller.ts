import { CurrentUserProfile, UserEditClientData, UserInterface, UserProfile } from "@shared/User";
import { Request, Response } from "express";
import moment from "moment";
import { DateRequest } from "../models/DateRequest";
import { User } from "../models/User";
import JSONRESPONSE from "../utils/JSONReponse";
import { upload, uploadFile } from "../utils/upload";
import { isDescription, isFullName, isUserName } from "../utils/validator";
import admin from "firebase-admin"
import { uuid } from "../utils/idgen";
import { currentUserAggregation } from "../aggregation/user-aggregation";
//util

export async function parseUser(_user: any, current_user:UserInterface): Promise<UserProfile>{
    if(!_user) return _user;
    const user: UserProfile = _user
    const now = moment(new Date());
    const birthday = moment(_user.birthday);
    const years = moment.duration(now.diff(birthday)).asYears();
    user.age = Math.floor(years);
    user.is_dating = user.dates.includes(current_user.uid);
    user.has_saved = current_user.saved_users.includes(user.uid);
    return user
}

export async function parseCurrentUser(_current_user: UserInterface|undefined){
    if(!_current_user) return;
    const user = <CurrentUserProfile>_current_user
    const now = moment(new Date());
    const birthday = moment(_current_user.birthday);
    const years = moment.duration(now.diff(birthday)).asYears();
    user.age = Math.floor(years);
    const fuser = await admin.auth().getUser(_current_user.uid);
    user.is_email_verified = fuser.emailVerified
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
    const user = await User.aggregate(currentUserAggregation(res.locals.uid)).exec();
    JSONReponse.success("success", await parseCurrentUser(user[0]))
}



//get user by uid

export async function getUserByUid(req: Request, res: Response){
    const JSONReponse = new JSONRESPONSE(res)
    const uid = req.params.uid;
    const currentUser_uid = res.locals.currentUser.uid
    if(!uid) return JSONReponse.notFound("User Not Found :(")
    try{
        const user = await User.aggregate([
            {$match: { uid }},
            {
                $lookup: {
                    from: "daterequests",
                    as: "current_user_daterequests",
                    let: { user_id: "$uid" },
                    foreignField: "request_sent_to",
                    localField: "uid",
                    pipeline: [
                        {
                            $match: { 
                                $and: [
                                    
                                    {request_sent_by: currentUser_uid}
                                ]
                            }
                        }
                    ]
                }
            },
            {
                $lookup: {
                    from: "daterequests",
                    as: "user_daterequests",
                    let: { user_id: "$uid" },
                    foreignField: "request_sent_by",
                    localField: "uid",
                    pipeline: [
                        {
                            $match: { 
                                $and: [
                                    
                                    {request_sent_to: currentUser_uid}
                                ]
                            }
                        }
                    ]
                }
            },
            {
                $addFields: {
                    is_dating: { $in: [currentUser_uid, "$dates"] },
                    has_current_sent_date_request: { $cond: [ { $eq: [{ $size: "$current_user_daterequests" }, 0]}, false, true ] },
                    has_this_user_sent_date_request: { $cond: [ { $eq: [{ $size: "$user_daterequests" }, 0]}, false, true ] }
                }
            },
        ]);
        JSONReponse.success("success", await parseUser(user[0], res.locals.currentUser));
    }catch(err){
        console.log(err)
        JSONReponse.serverError()
    }
}

//get saved use

export const getSavedUsers = async (req: Request, res: Response) => {
    const JSONReponse = new JSONRESPONSE(res)
    const uid = res.locals.uid;
    const currentUser: UserInterface = res.locals.currentUser
    try{
        const uids = currentUser.saved_users;
        let users = await User.find({uid: { $in: uids }}).select({ username: 1, uid: 1, full_name: 1, first_name: 1, profile_picture_url: 1, birthday: 1 }).lean().exec();
        users = users.map((user: any)=>{
            const now = moment(new Date());
            const birthday = moment(user.birthday);
            const years = moment.duration(now.diff(birthday)).asYears();
            user.age = Math.floor(years);
            return user;
        })
        
        JSONReponse.success("successfully got users", users)
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
            //url = false
            //pfp = false
            //true && true
            let url: string|undefined = current_user.profile_picture_url;
            if(!url) return JSONReponse.clientError("You need to add a profile picture")
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
            const updatedUser = await User.aggregate(currentUserAggregation(res.locals.uid)).exec();
            return JSONReponse.success("success", await parseCurrentUser(updatedUser[0]))
        }catch(err: any){
            console.log(err)
            JSONReponse.serverError()
        }
    })
}


//save user 

export const saveUser = async (req: Request, res: Response) => {
    const JSONReponse = new JSONRESPONSE(res);
    const c_uid: string = res.locals.uid;
    const uid = req.params.uid;
    try{
        const hasUser = await User.findOne({uid});
        if(!hasUser) return JSONReponse.notFound("user not found");
        await User.findOneAndUpdate({uid: c_uid}, { $push: { saved_users: uid } });
        JSONReponse.success("saved")
    }catch(err){
        console.log(err)
        JSONReponse.serverError()
    }
}

//unsave user

export const unsaveUser = async(req: Request, res: Response) => {
    const JSONReponse = new JSONRESPONSE(res);
    const c_uid: string = res.locals.uid;
    const uid = req.params.uid;
    try{
        await User.findOneAndUpdate({uid: c_uid}, { $pull: { saved_users: uid } });
        JSONReponse.success("unsaved")
    }catch(err){
        console.log(err)
        JSONReponse.serverError()
    }
}

export const changePersonality = async (req: Request, res: Response) => {
    const JSONReponse = new JSONRESPONSE(res);
    const currentUser: UserInterface = res.locals.currentUser;
    try {
        const type = parseInt(req.body.type||"0");
        if(type > 17) return JSONReponse.clientError("invalid type");
        await User.findOneAndUpdate({uid: currentUser.uid}, { $set: { personality_type: type } } );
        JSONReponse.success()
    } catch (error) {
        console.log(error)
    }
}
