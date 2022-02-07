import { TextMessageData } from "@shared/Chat";
import { Schema, model } from "mongoose";

const message = new Schema<TextMessageData>({
    type: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    sender_uid: {
        type: String,
        required: true
    },
    message_id: {
        type: String,
        required: true
    },
    receiver_uid: {
        type: String,
        required: false
    }
}, { timestamps: true })

const MessageModel = model("message", message);
export default MessageModel