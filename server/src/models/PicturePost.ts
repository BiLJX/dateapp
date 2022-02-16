import { model, Schema } from "mongoose";
import { PicturePostSchema } from "@shared/PicturePost"
const PicturePostModel = new Schema<PicturePostSchema>({
    picture_id: {
        unique: true,
        type: String
    },
    caption: {
        required: true,
        type: String
    },
    posted_by_uid: {
        required: true,
        type: String
    },
    picture_url: {
        required: true,
        type: String
    },
    liked_by: {
        type: [String],
        default: []
    }
}, {timestamps: true, toJSON: { virtuals: true }}
)

PicturePostModel.virtual("uploader_data", {
    ref: "User",
    foreignField: "uid",
    localField: "posted_by_uid",
    justOne: true
})

const PicturePost = model("picture", PicturePostModel);
export { PicturePost }