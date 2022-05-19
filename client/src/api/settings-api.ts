import { FeedSettingsInterface } from "@shared/Settings"
import axios from "./instance"

export const getFeedSettings = async () => {
    const res = await axios.get("/api/settings/feed");
    return res.data as ApiResponse<FeedSettingsInterface>;
}

export const updateFeedSettings = async (settings: FeedSettingsInterface) => {
    const res = await axios.patch("/api/settings/feed/update", settings);
    return res.data as ApiResponse<FeedSettingsInterface>;
}