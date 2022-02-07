import jwt from "jsonwebtoken"
import { User } from "../models/User";
export function getUid(jwt_token: string){
    try{
        const user = <any>jwt.decode(jwt_token)
        return <string|null>user.user_id;
    }catch(err){
        return null
    }
}

export async function getUser(uid: string){
    try{
        return (await User.findOne({uid}))?.toJSON()
    }catch(err){
        return null
    }
}