import { NotificationInterface } from "@shared/Notify";
import axios from "./instance"
export const getNotifications = async () => {
    const notifications: ApiResponse<NotificationInterface<any>[]>  = (await axios.get("/api/notifications")).data;
    return notifications;
}