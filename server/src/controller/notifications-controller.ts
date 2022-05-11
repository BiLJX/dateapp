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
                $unwind: '$sender_data'
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
                                ]
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

export const seeNotifications = async (req: Request, res: Response) => {
    const currentUid: string = res.locals.uid;
    const JSONResponse = new JSONRESPONSE(res);
    try {
        await Notifications.updateMany({ receiver: currentUid }, { $set: { has_read: true } });
        JSONResponse.success()
    } catch (error) {
        JSONResponse.serverError()
    }
}