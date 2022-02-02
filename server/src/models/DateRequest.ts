import { Schema, model } from "mongoose";
import { DateRequest } from "@shared/Dates"


const data_request_schema = new Schema<DateRequest>({
    request_sent_to: {
        type: String,
        required: true
    },
    request_sent_by: {
        type: String,
        required: true
    },
},{timestamps: true})


const DateRequest = model("DateRequest", data_request_schema)
export { DateRequest }