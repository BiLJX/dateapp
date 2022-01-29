import { UserEditClientData, UserInterface } from "@shared/User";
import { Request, Response } from "express";
import moment from "moment";
import { User } from "../models/User";
import JSONRESPONSE from "../utils/JSONReponse";
import { isFullName, isUserName } from "../utils/validator";

//util

export function parseUser(user: any){
    if(!user) return user;
    const now = moment(new Date());
    const birthday = moment(user.birthday);
    const years = moment.duration(now.diff(birthday)).asYears();
    user.age = Math.floor(years);
    return user
}


//get users

export async function getUsers(req: Request, res: Response){
    const JSONReponse = new JSONRESPONSE(res)
    try{
        const users = await User.find({})
        const parsed_users = users.map(x=>parseUser(x.toJSON()))
        JSONReponse.success("success", parsed_users)
    }catch(err){
        console.log(err)
        JSONReponse.serverError()
    }
    
}


//get current user

export function getCurrentUser(req: Request, res: Response){
    const JSONReponse = new JSONRESPONSE(res)
    const user = req.app.locals.currentUser;
    JSONReponse.success("success", parseUser(user?.toJSON()))
}



//get user by uid

export async function getUserByUid(req: Request, res: Response){
    const JSONReponse = new JSONRESPONSE(res)
    const uid = req.params.uid
    if(!uid) return JSONReponse.notFound("User Not Found :(")
    try{
        const user = await User.findOne({uid});
        JSONReponse.success("success", parseUser(user?.toJSON()));
    }catch(err){
        console.log(err)
        JSONReponse.serverError()
    }
}

//edit user data

export async function editUserProfile(req: Request, res: Response){
    const JSONReponse = new JSONRESPONSE(res);
    const uid = req.app.locals.uid;
    const { full_name, username, description, gender }: UserEditClientData = req.body;
    try{
        //validation
        if(!isUserName(username)) return JSONReponse.clientError("invalid username or username is less than 3 charecter");
        if(!isFullName(full_name)) return JSONReponse.clientError("invalid name");
        const user = await User.findOneAndUpdate({uid}, {$set: {
            full_name,
            username,
            description,
            gender: gender.toLowerCase()
        }})
        JSONReponse.success("success", user?.toJSON())
    }catch(err: any){
        console.log(err)
        JSONReponse.clientError(err.message)
    }
}






