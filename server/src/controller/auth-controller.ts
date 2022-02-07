import { SignupData } from "@shared/Auth";
import { Request, Response } from "express";
import { User } from "../models/User";
import JSONRESPONSE from "../utils/JSONReponse";
import { isFullName, isUserName } from "../utils/validator";
import admin from "firebase-admin"
import { getAuth, signInWithEmailAndPassword } from "firebase/auth"
import { app } from "../fire";
import moment from "moment"
import { parseUser } from "./user-controller";

const auth = getAuth(app);
export async function createAccount(req: Request, res: Response){
    const JSONReponse = new JSONRESPONSE(res)
    const client_data = <SignupData|undefined>req.body;
    let userId: string = ""
    try {
        if(!client_data) return JSONReponse.clientError("no data found");
        const splited_name = client_data.full_name.trim().split(" ")
        const currentTime = moment(new Date());
        const client_birthday = moment(client_data.birthday);
        const duration = moment.duration(currentTime.diff(client_birthday))
        const years = duration.asYears()
        //validations
        if(isNaN(years) || years<13) return JSONReponse.clientError("Sorry, only age above 13 can create account");
        if(splited_name.length === 0)return JSONReponse.clientError("please enter name");
        if(!isFullName(client_data.full_name)) return JSONReponse.clientError("invalid name");
        if(!isUserName(client_data.username)) return JSONReponse.clientError("invalid username or username is less than 3 charecter");
        
        //creating account from firebase
        
       

        //saving datas
        const data: any = {
            ...client_data,
            username: client_data.username?.trim().toLocaleLowerCase(),
            gender: client_data.gender?.trim().toLocaleLowerCase(),
            first_name: splited_name[0]?.trim(),
            last_name: splited_name.length > 2 ? splited_name[1] + " " + splited_name[2] : splited_name[1]||"",
        }

        const { uid } = await admin.auth().createUser({
            email: client_data.email,
            password: client_data.password
        })
        userId = uid;
        data.uid = uid;
        
        const user = new User(data)
        await user.save()

        //signing user
        const signed_user = (await signInWithEmailAndPassword(auth, client_data.email, client_data.password)).user;
        const idToken = await signed_user.getIdToken()
        if(!idToken) return res.status(401).end();
        const expiresIn = 60*60*24*14*1000;
        const sessionCookie = await admin.auth().createSessionCookie(idToken, {expiresIn});
        const options = {maxAge: expiresIn, httpOnly: false};
        res.cookie("session", sessionCookie, options);

        //success
        JSONReponse.success("created account", await parseUser(user.toJSON(), user.toJSON()))
    } catch (error: any) {
        console.log(error)
        await admin.auth().deleteUser(userId).catch(err=>console.log(err))
        JSONReponse.clientError(( error.message || "Username already taken" ))
    }
}

export async function login(req: Request, res: Response){
    
    const JSONReponse = new JSONRESPONSE(res)
    try{
        const { user } = await signInWithEmailAndPassword(auth, req.body.email, req.body.password);
        const idToken = await user.getIdToken()
        if(!idToken) return res.status(401).end();
        const expiresIn = 60*60*24*14*1000;
        const sessionCookie = await admin.auth().createSessionCookie(idToken, {expiresIn});
        const options = {maxAge: expiresIn, httpOnly: false};
        const currentUser = <any>(await User.findOne({uid: user.uid }))?.toJSON();

        res.cookie("session", sessionCookie, options);
        JSONReponse.success("logged in", await parseUser(currentUser, currentUser));
    }catch(err: any){
        JSONReponse.clientError("Either email or password does not match");
    }
}

