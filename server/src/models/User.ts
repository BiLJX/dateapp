import { Schema, model } from "mongoose";
import { UserInterface } from "@shared/User"
const UserSchema = new Schema<UserInterface>({
    uid: {
        type: String,
        unique: true,
        required: true
    },
    username: {
        type: String,
        required: true,
        min: 3,
        max: 15
    },
    full_name: {
        type: String,
        required: true
    },
    first_name: {
        type: String,
        min: 3,
        max: 15,
        required: true
    },
    last_name: {
        type: String,
        max: 15,
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    description: {
        type: String,
        min: 10,
        max: 50
    },
    gender: {
        type: String,
        default: "hide"
    },
    birthday: {
        type: String,
    },
    hobbies: {
        type: [String],
        default: []
    },
    personality_type: {
        type: Number,
        default: 0
    },
    saved_users: {
        type: [String],
        default: []
    },
    profile_picture_url: {
        type: String,
        default: ""
    },
    cover_picture_url: {
        type: String,
        default: ""
    },
    dates: {
        type: [String],
        default: []
    },
    is_admin: {
        type: Boolean,
        default: false
    },
    account_setuped: {
        type: Boolean,
        default: false
    }
},
{timestamps: true}
)
UserSchema.index({username: "text", description: "text", full_name: "text"})
const User = model<UserInterface>("User", UserSchema)
export { User }