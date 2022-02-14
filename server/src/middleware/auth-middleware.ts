import { Request, Response, NextFunction } from "express";
import JSONRESPONSE from "../utils/JSONReponse";
import jwt from "jsonwebtoken"
import { User } from "../models/User";

export async function AuthMiddleware(req: Request, res: Response, next:NextFunction){
    const JSONResponse = new JSONRESPONSE(res);
    try{
        const session = req.cookies.session;
        if(!session) return JSONResponse.notAuthorized();
        const decoded = <any>jwt.decode(session);
        const uid = decoded.user_id
        if(!uid) return JSONResponse.notAuthorized();
        const user = await User.findOne({uid})
        if(!user) return JSONResponse.notAuthorized();
        req.app.locals.currentUser = user;
        req.app.locals.uid = uid;
        res.locals.currentUser = user;
        res.locals.uid = uid;
        next()
    }catch(err){
        req.app.locals.uid = null;
        req.app.locals.currentUser = null;
        res.locals.uid = null;
        res.locals.currentUser = null;
        console.log(err);
        JSONResponse.notAuthorized();
    }

}