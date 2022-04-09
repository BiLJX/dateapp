import { Server } from "socket.io";
import { NotificationInterface } from "shared/Notify"
export default class Notification {
    constructor(private socket: Server){}
    public dateRequest(notification_data: NotificationInterface){
        const socket = this.socket;
        socket.to(notification_data.receiver).emit("notification", notification_data);
    }
}