import { SignupData } from "@shared/Auth";
import { Request, Response } from "express";
import { User } from "../models/User";
import JSONRESPONSE from "../utils/JSONReponse";
import { isFullName, isUserName } from "../utils/validator";
import admin from "firebase-admin"
import { getAuth, sendEmailVerification, signInWithEmailAndPassword } from "firebase/auth"
import { app } from "../fire";
import moment from "moment"
import { parseCurrentUser, parseUser } from "./user-controller";
import jwt from "jsonwebtoken"
import sendVerificationEmail from "../utils/email";
import {currentUserAggregation} from "../aggregation/user-aggregation"
const auth = getAuth(app);

export async function createAccount(req: Request, res: Response){
    const JSONReponse = new JSONRESPONSE(res)
    const client_data = <SignupData|undefined>req.body;
    let userId: string = ""
    try {
        if(!client_data) return JSONReponse.clientError("no data found");
        const currentTime = moment(new Date());
        const client_birthday = moment(client_data.birthday);
        const duration = moment.duration(currentTime.diff(client_birthday))
        const years = duration.asYears()
        //validations
        
        if(!isFullName(client_data.full_name)) return JSONReponse.clientError("invalid name");
        if(isNaN(years) || years<13) return JSONReponse.clientError("Sorry, only age above 13 can create account");
        if(!isUserName(client_data.username)) return JSONReponse.clientError("invalid username or username is less than 3 charecter");
        const splited_name = client_data.full_name?.trim().split(" ");
        if(splited_name.length === 0)return JSONReponse.clientError("please enter name");
        
        //creating account from firebase
        
       client_data.email = client_data.email?.toString()?.toLocaleLowerCase()?.trim();

        //saving datas
        const data: any = {
            ...client_data,
            username: client_data.username?.trim().toLocaleLowerCase(),
            gender: client_data.gender?.trim().toLocaleLowerCase(),
            first_name: splited_name[0]?.trim(),
            last_name: splited_name.length > 2 ? splited_name[1] + " " + splited_name[2] : splited_name[1]||"",
        }

        const { uid } = await admin.auth().createUser({
            email: client_data.email?.toString()?.toLocaleLowerCase()?.trim(),
            password: client_data.password
        })

        userId = uid;
        data.uid = uid;
        
        const user = new User(data)
        await user.save()
        const link = await admin.auth().generateEmailVerificationLink(user.email);
        await sendVerificationEmail({name: data.first_name, email: client_data.email, link: link})
        //signing user
        const signed_user = (await signInWithEmailAndPassword(auth, client_data.email, client_data.password)).user;
        const idToken = await signed_user.getIdToken()
        if(!idToken) return res.status(401).end();
        const expiresIn = 60*60*24*14*1000;
        const sessionCookie = await admin.auth().createSessionCookie(idToken, {expiresIn});
        const options = {maxAge: expiresIn, httpOnly: false};
        res.cookie("session", sessionCookie, options);
        //success
        JSONReponse.success("created account",await parseCurrentUser(user.toJSON()))

    } catch (error: any) {
        console.log(error)
        await admin.auth().deleteUser(userId).catch(err=>console.log(err))
        JSONReponse.clientError(( error.message || "Some Thing Went Wrong" ))
    }
}

export async function login(req: Request, res: Response){
    const JSONReponse = new JSONRESPONSE(res)
    try{
        const { user } = await signInWithEmailAndPassword(auth, req.body?.email?.toString()?.trim(), req.body.password);
        const idToken = await user.getIdToken()
        if(!idToken) return res.status(401).end();
        const expiresIn = 60*60*24*14*1000;
        const sessionCookie = await admin.auth().createSessionCookie(idToken, {expiresIn});
        const options = {maxAge: expiresIn, httpOnly: false};
        const uid = user.uid;
        const currentUser = await User.aggregate(currentUserAggregation(uid)).exec();
        res.cookie("session", sessionCookie, options);
        JSONReponse.success("logged in", await parseCurrentUser(currentUser[0]));
    }catch(err: any){
        console.log(err)
        JSONReponse.clientError("Either email or password does not match");
    }
}


export const sendVerification = async (req: Request, res: Response) => {
    const JSONResponse = new JSONRESPONSE(res);
    try{
        const session = req.cookies.session || req.headers.session;
        if(!session) return JSONResponse.notAuthorized();
        const decoded = <any>jwt.decode(session);
        const uid = decoded.user_id
        if(!uid) return JSONResponse.notAuthorized();
        const user = await User.findOne({uid});
        if(!user) return JSONResponse.notAuthorized();
        const { emailVerified } = await admin.auth().getUser(user.uid);
        if(emailVerified) return JSONResponse.clientError("already verified")
        const link = await admin.auth().generateEmailVerificationLink(user.email);
        await sendVerificationEmail({name: user.first_name, email: user.email, link});
        JSONResponse.success("Verification has been sent to your email")
    } catch(err){
        console.log(err);
        JSONResponse.clientError("verification has been sent, please try later")
    }
}

export const changeEmail = async (req: Request, res: Response) => {
    const JSONResponse = new JSONRESPONSE(res);
    try{
        const session = req.cookies.session || req.headers.session;
        if(!session) return JSONResponse.notAuthorized();
        const decoded = <any>jwt.decode(session);
        const uid = decoded.user_id
        if(!uid) return JSONResponse.notAuthorized();
        const user = await User.findOne({uid});
        if(!user) return JSONResponse.notAuthorized();
        const { emailVerified } = await admin.auth().getUser(user.uid);
        if(emailVerified) return JSONResponse.clientError("already verified")
        const email = req.body?.email?.toLocaleLowerCase().trim();
        if(!email) return JSONResponse.clientError("no email provided");
        const task1 = admin.auth().updateUser(user.uid, { email })
        const task2 = User.findOneAndUpdate({uid}, { $set: { email } })
        await Promise.all([task1, task2]);
        JSONResponse.success("Email changed please click on resend verification");
    } catch(err: any){
        console.log(err);
        JSONResponse.clientError(( "email already on use" ))
    }
}

