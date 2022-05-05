import { Schema, model } from "mongoose";
import { NotificationInterface } from "@shared/Notify";

const schema = new Schema<NotificationInterface>({
    notification_id: {
        required: true,
        unique: true,
        type: String,
    },
    sender: {
        required: true,
        type: String
    },
    receiver: {
        required: true,
        type: String
    },
    type: {
        required: true,
        type: String
    },
    has_read: {
        required: true,
        type: Boolean
    }
}, {timestamps: true, toJSON: {
    virtuals: true
}})

schema.virtual("sender_data", {
    ref: "User",
    localField: "sender",
    foreignField: "uid",
    justOne: true
})

const Notifications = model("notification", schema);
export { Notifications }
