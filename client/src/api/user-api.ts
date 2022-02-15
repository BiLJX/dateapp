import axios from "./instance"
import { UserProfile, UserEditClientData, CurrentUserProfile } from "@shared/User"
import { Area } from "react-easy-crop/types"
export async function getUserByUid(uid: string){
    const res = (await axios.get("/api/user/"+uid)).data;
    return <ApiResponse<UserProfile>>res;
}

export async function getUsers(page: number){
    const res = (await axios.get("/api/user/?page="+page)).data;
    return <ApiResponse<UserProfile[]>>res
}

export async function updateProfile(data: UserEditClientData, pfp?: File){
    const formdata = new FormData()
    formdata.append("username", data.username);
    formdata.append("full_name", data.full_name);
    formdata.append("birthday", data.birthday);
    formdata.append("gender", data.gender)
    formdata.append("description", data.description);
    pfp && formdata.append("pfp", pfp);
    const res = (await axios.patch("/api/user/edit/", formdata)).data;
    return <ApiResponse<CurrentUserProfile>>res
}

export async function updatePfp(pfp: File, area: Area){
    const formdata = new FormData();
    formdata.append("pfp", pfp);
    formdata.append("x", area.x.toString());
    formdata.append("y", area.y.toString());
    formdata.append("width", area.width.toString());
    formdata.append("height", area.height.toString());
    const res = (await axios.put<ApiResponse<{url: string}>>("/api/user/edit/pfp", formdata)).data;
    return res
}

export async function updateCover(cover: File, area: Area){
    const formdata = new FormData();
    formdata.append("pfp", cover);
    formdata.append("x", area.x.toString());
    formdata.append("y", area.y.toString());
    formdata.append("width", area.width.toString());
    formdata.append("height", area.height.toString());
    const res = (await axios.put<ApiResponse<{url: string}>>("/api/user/edit/cover", formdata)).data;
    return res
}

export async function saveUser(uid: string){
    const res = await axios.put(`/api/user/${uid}/save`);
    return <ApiResponse<{}>>res.data
}

export async function unsaveUser(uid: string){
    const res = await axios.delete(`/api/user/${uid}/unsave`);
    return <ApiResponse<{}>>res.data
}