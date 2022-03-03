import { HobbySchema } from "@shared/User";
import axios from "./instance"

export const getUserHobby = async (uid: string) => {
    const res = await axios.get("/api/hobbies/"+uid);
    return res.data as ApiResponse<HobbySchema[]>
}

export const getHobbies = async (name: string = "") => {
    const res = await axios.get("/api/hobbies?s="+name);
    return res.data as ApiResponse<HobbySchema[]>
}

export const addHobby = async (hobby: string) => {
    const res = await axios.put("/api/hobbies/hobby/add", {hobby});
    return res.data as ApiResponse<{}>
}

export const removeHobby = async (hobby: string) => {
    const res = await axios.delete("/api/hobbies/hobby/"+hobby);
    return res.data as ApiResponse<{}>
}