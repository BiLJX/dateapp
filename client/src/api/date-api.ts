import { UserProfile } from "@shared/User"
import axios from "./instance"


export const getIncomingRequests = async ()=>{
    const res = await axios.get<ApiResponse<UserProfile[]>>("/api/date/requests/incoming");
    return res.data;
}

export const sendDateRequest = async (uid: string) => {
    const res = await axios.post<ApiResponse<{}>>("/api/date/request/"+uid);
    return res.data;
}

export const cancelDateRequest = async (uid: string) => {
    const res = await axios.delete<ApiResponse<{}>>("/api/date/request/"+uid+"/cancel");
    return res.data;
}

export const acceptDateRequest = async (uid: string) => {
    const res = await axios.post<ApiResponse<{}>>(`/api/date/request/${uid}/accept`);
    return res.data;
}

export const deletetDateRequest = async (uid: string) => {
    const res = await axios.post<ApiResponse<{}>>(`/api/date/request/${uid}/reject`);
    return res.data;
}