import axios from "./instance"
import { UserProfile, CurrentUserProfile } from "@shared/User"
import { SignupData } from "@shared/Auth"

export async function getCurrentUser(){
    const res = await axios.get("/api/user/current")
    return <ApiResponse<CurrentUserProfile>>res.data;
}

export async function loginWithEmailAndPassowrd(email: string, password: string){
    const res = await axios.post("/api/auth/login", {email, password})
    return <ApiResponse<CurrentUserProfile>>res.data;
}

export async function signUpWithEmailAndPassword(data: SignupData){
    const res = await axios.post("/api/auth/signup", data)
    return <ApiResponse<CurrentUserProfile>>res.data;
}

export async function changeUserEmail(email: string){
    const res = await axios.post("/api/auth/change/email", { email: email });
    return <ApiResponse<{}>>res.data
}

export async function sendVerification(){
    const res = await axios.post("/api/auth/verify/email");
    return <ApiResponse<{}>>res.data
}

export async function signOut(){
    const res = await axios.post("/api/auth/signout");
    return res.data
}