import axios from "./instance"
import { UserProfile, UserEditClientData } from "@shared/User"

export async function updateProfile(data: UserEditClientData, pfp?: File){
    const formdata = new FormData()
    formdata.append("username", data.username);
    formdata.append("full_name", data.full_name);
    formdata.append("birthday", data.birthday);
    formdata.append("gender", data.gender)
    formdata.append("description", data.description);
    pfp && formdata.append("pfp", pfp);
    const res = (await axios.patch("/api/user/edit/", formdata)).data;
    return <ApiResponse<UserProfile>>res
}