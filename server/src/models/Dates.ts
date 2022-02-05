import { UserDate } from "@shared/Dates";
import { Schema, model } from "mongoose";


const date = new Schema<UserDate>({
    uid: {
        type: String,
        required: true
    },
    date_user_uid: {
        type: String,
        required: true
    },
    has_read_message: {
        type: Boolean,
        default: false
    },
    is_fav_chat: {
        type: Boolean,
        default: false
    },
    latest_message: {
        type: String,
        default: "Tap to Chat"
    }
}, {timestamps: true, toJSON: {
    virtuals: true
}})

date.virtual("date_user_data", {
    ref: "User",
    localField: "date_user_uid",
    foreignField: "uid",
    justOne: true
})

const UserDate = model("user_date", date)

export { UserDate }