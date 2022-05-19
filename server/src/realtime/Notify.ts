import { Server } from "socket.io";
import { NotificationInterface } from "shared/Notify"
import { Notifications } from "../models/Notification";
export default class Notification {
    constructor(private socket: Server){}
    public dateRequest(notification_data: NotificationInterface){
        const socket = this.socket;
        socket.to(notification_data.receiver).emit("notification", notification_data);
    }
    public async dateAccept(notification_data: NotificationInterface){
        const socket = this.socket;
        const has_notifications = await Notifications.findOne({sender: notification_data.sender, receiver: notification_data.receiver, type: notification_data.type})
        if(has_notifications) return;
        const notification = new Notifications(notification_data);
        await notification.save()
        socket.to(notification_data.receiver).emit("notification", notification_data);
    }
    public async unMatch(notification_data: NotificationInterface){
        const socket = this.socket;
        const has_notifications = await Notifications.findOne({sender: notification_data.sender, receiver: notification_data.receiver, type: notification_data.type})
        if(has_notifications) return;
        const notification = new Notifications(notification_data);
        await notification.save()
        socket.to(notification_data.receiver).emit("notification", notification_data);
    }
    public async likePost(notification_data: NotificationInterface<{picture_url: string}>){
        if(notification_data.sender === notification_data.receiver) return;
        const socket = this.socket;
        const has_notifications = await Notifications.findOne({sender: notification_data.sender, receiver: notification_data.receiver, type: notification_data.type, content_id: notification_data.content_id})
        if(has_notifications) return;
        const notification = new Notifications(notification_data);
        await notification.save()
        socket.to(notification_data.receiver).emit("notification", notification_data);
    }
}