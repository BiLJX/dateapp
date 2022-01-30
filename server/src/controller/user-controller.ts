import { UserEditClientData, UserInterface } from "@shared/User";
import { Request, Response } from "express";
import moment from "moment";
import { User } from "../models/User";
import JSONRESPONSE from "../utils/JSONReponse";
import { upload, uploadFile } from "../utils/upload";
import { isDescription, isFullName, isUserName } from "../utils/validator";

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
    upload(req, res, async (err)=>{
        const JSONReponse = new JSONRESPONSE(res);
        const uid = req.app.locals.uid;
        const { full_name, username, description, gender }: UserEditClientData = req.body;
        const file: any = req.files
        const pfp = file[0]
        const current_user = <UserInterface>req.app.locals.currentUser
        try{
            //validation
            let url: string|undefined;
            if(pfp){
                const size = pfp.size / 1024 / 1024;
                if(size > 60) return JSONReponse.clientError("invalid thumbnail type");
                if (pfp.mimetype === "image/png" || pfp.mimetype === "image/jpg" || pfp.mimetype === "image/jpeg"){
                    url = await uploadFile(pfp, `user/${uid}/pfp/`)
                }else{
                    return JSONReponse.clientError("invalid thumbnail type");
                }
            }
            if(!url && !current_user.account_setuped) return JSONReponse.clientError("You need to add a profile picture")
            if(!isUserName(username)) return JSONReponse.clientError("invalid username or username is less than 3 charecter");
            if(!isFullName(full_name)) return JSONReponse.clientError("invalid name");
            if(!isDescription(description)) return JSONReponse.clientError("description is less than 10 or more than 100 charecters")
            
            if(url){
                const user = await User.findOneAndUpdate({uid}, {$set: {
                    full_name,
                    username,
                    description,
                    gender: gender.toLowerCase(),
                    profile_picture_url: url,
                    account_setuped: true
                }})
                return JSONReponse.success("success", user?.toJSON())
            }
            const user = await User.findOneAndUpdate({uid}, {$set: {
                full_name,
                username,
                description,
                gender: gender.toLowerCase(),
            }})
            return JSONReponse.success("success", user?.toJSON())
            
            
           
        }catch(err: any){
            console.log(err)
            JSONReponse.clientError(err.message)
        }
    })
    
}






