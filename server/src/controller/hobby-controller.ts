import { Request, Response } from "express";
import JSONRESPONSE from "../utils/JSONReponse";
import { hobbies } from "../utils/hobbies";
import { User } from "../models/User";
import { HobbySchema, UserInterface } from "@shared/User";


export const getHobbies = async (req: Request, res: Response) => {
    const JSONResponse = new JSONRESPONSE(res);
    try {
        const queryString: string|undefined = <string>req.query.s;
        const currentUser: UserInterface = res.locals.currentUser;
        const lim = 20
        if(!queryString){
            const found = hobbies.slice(0, lim)
            const data: HobbySchema[] = found.map(x=>({
                name: x,
                type: "HOBBY",
                does_user_have_this_hobby: currentUser.hobbies.includes(x)
            }))
            return JSONResponse.success("success", data)
        }
        const found = hobbies.filter(x=>x.toLocaleLowerCase().includes(queryString.toLocaleLowerCase()))?.slice(0, lim);
        const data: HobbySchema[] = found.map(x=>({
            name: x,
            type: "HOBBY",
            does_user_have_this_hobby: currentUser.hobbies.includes(x)
        }))
        return JSONResponse.success("success", data)
    }catch(err){
        console.log(err);
        JSONResponse.serverError()
    }
}

export const getUserHobby = async (req: Request, res: Response) => {
    const JSONResponse = new JSONRESPONSE(res);
    const currentUser: UserInterface = res.locals.currentUser;
    const uid = req.params.uid
    try{
        if(!uid) return JSONResponse.clientError("invalid uid");
        const hobbies = (await User.findOne({uid}))?.hobbies || []
        const data: HobbySchema[] = hobbies.map(x=>({
            name: x,
            type: "HOBBY",
            does_user_have_this_hobby: currentUser.hobbies.includes(x)
        }))
        return JSONResponse.success("success", data)
    }catch(err){
        console.log(err);
        JSONResponse.serverError()
    }
}

export const addHobby = async (req: Request, res: Response) => {
    const JSONResponse = new JSONRESPONSE(res);
    const currentUser: UserInterface = res.locals.currentUser;
    try{
        const hobby: string = req.body.hobby
        if(!hobbies.includes(hobby)) return JSONResponse.clientError("invalid hobby");
        if(currentUser.hobbies.includes(hobby)) return JSONResponse.clientError("hobby already included")
        await User.findOneAndUpdate({uid: currentUser.uid}, { $push: { hobbies: hobby } });
        JSONResponse.success()
    }catch(err){
        console.log(err);
        JSONResponse.serverError()
    }
}

export const removeHobby = async (req: Request, res: Response) => {
    const JSONResponse = new JSONRESPONSE(res);
    const currentUser: UserInterface = res.locals.currentUser;
    try{
        const hobby: string = req.params.hobby
        if(!hobbies.includes(hobby)) return JSONResponse.clientError("invalid hobby");
        if(!currentUser.hobbies.includes(hobby)) return JSONResponse.clientError("You dont have that hobby")
        await User.findOneAndUpdate({uid: currentUser.uid}, { $pull: { hobbies: hobby } });
        JSONResponse.success()
    }catch(err){
        console.log(err);
        JSONResponse.serverError()
    }
}