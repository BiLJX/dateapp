import { UserProfile } from "@shared/User"
import { UserDate } from "@shared/Dates"
import axios from "./instance"

/*       Date Requests         */

export const getIncomingRequests = async ()=>{
    const res = await axios.get<ApiResponse<UserProfile[]>>("/api/date/requests/incoming");
    return res.data;
}

export const getSentRequests = async () => {
    const res = await axios.get<ApiResponse<UserProfile[]>>("/api/date/requests/sent");
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

export const rejectDateRequest = async (uid: string) => {
    const res = await axios.delete<ApiResponse<{}>>(`/api/date/request/${uid}/reject`);
    return res.data;
}


/*               User Dates            */

export const getUserDates = async () => {
    const res = await axios.get<ApiResponse<UserDate[]>>("/api/date/");
    return res.data;
}

export const unDateUser = async (uid: string) => {
    const res = await axios.delete<ApiResponse<{}>>("/api/date/remove/"+uid);
    return res.data;
}

