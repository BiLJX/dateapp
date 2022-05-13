import { NotificationInterface } from "@shared/Notify";
import { Request, Response } from "express"
import { Notifications } from "../models/Notification";
import JSONRESPONSE from "../utils/JSONReponse";

export const NotificationsController = async (req: Request, res: Response) => {
    const currentUid: string = res.locals.uid;
    const JSONResponse = new JSONRESPONSE(res);
    try {
        const notifications = await Notifications.aggregate([
            {
                $match: { receiver: currentUid }
            },
            {   
                $lookup: {
                    from: "users",
                    foreignField: "uid",
                    localField: "sender",
                    as: "sender_data",
                }
            },
            {
                $lookup: {
                    from: "pictures",
                    foreignField: "picture_id",
                    localField: "content_id",
                    as: "picture",
                }
            },
            {
                $unwind: '$sender_data'
            },
            {
                $unwind: {
                    path: "$picture",
                    preserveNullAndEmptyArrays: true
                }
            },
            { 
                $addFields: {
                    "sender_data.name": "$sender_data.username",
                    "text": { 
                            $switch: { 
                                branches: [
                                    { 
                                        case: { $eq: ["$type", "UNMATCHED"] },
                                        then: "removed you from date"
                                    },
                                    { 
                                        case: { $eq: ["$type", "DATE_ACCEPTED"] },
                                        then: "accepted your date"
                                    },
                                    { 
                                        case: { $eq: ["$type", "DATE_REQUEST"] },
                                        then: "requested to date"
                                    },
                                    { 
                                        case: { $eq: ["$type", "LIKED_POST"] },
                                        then: "liked your post"
                                    },
                                ]
                            } 
                    },
                    "content": {
                        $cond: {
                            if:  { $eq: ["$type", "LIKED_POST"] },
                            then : { 
                                picture_url: "$picture.picture_url"
                            },
                            else: null
                        }
                    }
                }
            },
            
            { 
                $project: {
                    notification_id: 1,
                    type: 1,
                    has_read: 1,
                    text: 1,
                    sender: 1,
                    receiver: 1,
                    createdAt: 1,
                    content: 1,
                    sender_data: {
                        profile_picture_url: 1,
                        uid: 1,
                        name: 1
                    },
                }
            }
          
        ]).exec()
        JSONResponse.success("success", notifications);
        await Notifications.updateMany({ receiver: currentUid }, { $set: { has_read: true } });
    } catch (error) {
        console.log(error)
        JSONResponse.serverError()
    }
}
