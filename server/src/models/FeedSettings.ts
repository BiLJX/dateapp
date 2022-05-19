import { Schema, model } from "mongoose";
import { FeedSettingsInterface } from "@shared/Settings"
const feed_settings = new Schema<FeedSettingsInterface>({
    uid: {
        type: String,
        require: true
    },
    gender_filter: {
        type: String,
        enum: ['male', "female", "any"],
        default: "any"
    },
    looking_for: {
        type: String,
        enum: ["relationship", "friendship", "any"],
        default: "any"
    },
    personality_filter: {
        type: [Number],
        default: []
    },
    age_range: {
        min: {
            type: Number,
            min: 13,
            default: 13
        },
        max: {
            type: Number,
            max: 100,
            default: 100
        }
    },
    show_your_dates: {
        type: Boolean,
        default: true
    }
})

const FeedSettings = model("feedsettings", feed_settings);
export { FeedSettings }