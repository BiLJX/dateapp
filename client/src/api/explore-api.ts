import axios from "./instance";
import { ExploreData } from "@shared/Explore";

export const getExplore = async () => {
    const res = await axios.get("/api/explore");
    return res.data as ApiResponse<ExploreData[]>;
}

export const getQuickChats = async () => {
    const res = await axios.get("/api/explore/quickchats");
    return res.data as ApiResponse<ExploreData[]>;
}