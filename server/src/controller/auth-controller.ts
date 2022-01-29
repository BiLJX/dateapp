import { SignupData } from "@shared/Auth";
import { Request, Response } from "express";
import { User } from "../models/User";
import JSONRESPONSE from "../utils/JSONReponse";
import { isFullName, isUserName } from "../utils/validator";
import admin from "firebase-admin"
import { getAuth, signInWithEmailAndPassword } from "firebase/auth"
import { app } from "../fire";
import moment from "moment"
export async function createAccount(req: Request, res: Response){
    const JSONReponse = new JSONRESPONSE(res)
    const client_data = <SignupData|undefined>req.body;
    try {
        if(!client_data) return JSONReponse.clientError("no data found");
        const splited_name = client_data.full_name.split(" ")
        const currentTime = moment(new Date());
        const client_birthday = moment(client_data.birthday);
        const duration = moment.duration(currentTime.diff(client_birthday))
        const years = duration.asYears()
        //validations
        if(years<13) return JSONReponse.clientError("Sorry, only age above 13 can create account");
        if(splited_name.length === 0)return JSONReponse.clientError("please enter name");
        if(!isFullName(client_data.full_name)) return JSONReponse.clientError("invalid name");
        if(!isUserName(client_data.username)) return JSONReponse.clientError("invalid username or username is less than 3 charecter");
        
        //creating account from firebase
        
        const { uid } = await admin.auth().createUser({
            email: client_data.email,
            password: client_data.password
        })
        
        //saving datas
        const data = {
            ...client_data,
            uid,
            first_name: splited_name[0],
            last_name: splited_name.length > 2 ? splited_name[1] + " " + splited_name[2] : splited_name[1]||"",
        }
        
        const user = new User(data)
        await user.save()
        JSONReponse.success("created account", user)
    } catch (error: any) {
        console.log(error)
        JSONReponse.clientError(( error._message && "Username already taken" )||error.message)
    }
}

export async function login(req: Request, res: Response){
    const auth = getAuth(app);
    const JSONReponse = new JSONRESPONSE(res)
    try{
        const { user } = await signInWithEmailAndPassword(auth, req.body.email, req.body.password);
        const idToken = await user.getIdToken()
        if(!idToken) return res.status(401).end();
        const expiresIn = 60*60*24*14*1000;
        const sessionCookie = await admin.auth().createSessionCookie(idToken, {expiresIn});
        const options = {maxAge: expiresIn, httpOnly: true};
        res.cookie("session", sessionCookie, options);
        JSONReponse.success("logged in");
    }catch(err: any){
        JSONReponse.clientError(err.code || err.message);
    }
}

