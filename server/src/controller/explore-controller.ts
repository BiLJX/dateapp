import { UserInterface, UserProfile } from "@shared/User";
import { Request, Response } from "express";
import { User } from "../models/User";
import {  ExploreData } from "@shared/Explore"
import JSONRESPONSE from "../utils/JSONReponse";
import moment from "moment";
import { ActiveUsers } from "../realtime/ActiveUsers";

export const getExploreContents = async (req: Request, res: Response) => {
    const JSONReponse = new JSONRESPONSE(res);
    const currentUser: UserInterface = res.locals.currentUser;
    try {
        const user_hobbies: string[] = currentUser.hobbies;
        let users: UserProfile[] = await User.aggregate([
            {
                $match: {
                    $and: [
                        {hobbies: { $in: user_hobbies }},
                        {account_setuped: true},
                        {uid: { $ne: currentUser.uid }}
                    ]
                    
                }
            },
            {
                $lookup: {
                    from: "daterequests",
                    as: "current_user_daterequests",
                    let: { user_id: "$uid" },
                    foreignField: "request_sent_to",
                    localField: "uid",
                    pipeline: [
                        {
                            $match: { 
                                $and: [
                                    {request_sent_by: currentUser.uid}
                                ]
                            }
                        }
                    ]
                }
            },
            {
                $lookup: {
                    from: "daterequests",
                    as: "user_daterequests",
                    let: { user_id: "$uid" },
                    foreignField: "request_sent_by",
                    localField: "uid",
                    pipeline: [
                        {
                            $match: { 
                                $and: [
                                    
                                    {request_sent_to: currentUser.uid}
                                ]
                            }
                        }
                    ]
                }
            },
            {
                $addFields: {
                    is_dating: { $in: [currentUser.uid, "$dates"] },
                    has_current_sent_date_request: { $cond: [ { $eq: [{ $size: "$current_user_daterequests" }, 0]}, false, true ] },
                    has_this_user_sent_date_request: { $cond: [ { $eq: [{ $size: "$user_daterequests" }, 0]}, false, true ] }
                }
            },
        ])
        let flag: boolean = false; //checks if users are found
        let data: ExploreData[] = user_hobbies.map(x=>{
            return {
                label: "Interested in "+x,
                items: users.filter(user=>{
                    if(user) flag = true;
                    const now = moment(new Date());
                    const birthday = moment(user.birthday);
                    const years = moment.duration(now.diff(birthday)).asYears();
                    user.age =  Math.floor(years)
                    return user.hobbies.includes(x)
                })
            }
        })
        if(flag) return JSONReponse.success("success", data);

        //if no users are found then
        users = await User.aggregate([
            {
                $match: {
                    $and: [
                        {account_setuped: true},
                        {uid: { $ne: currentUser.uid }}
                    ]  
                }
            },
            {
                $limit: 30
            },
            {
                $lookup: {
                    from: "daterequests",
                    as: "current_user_daterequests",
                    let: { user_id: "$uid" },
                    foreignField: "request_sent_to",
                    localField: "uid",
                    pipeline: [
                        {
                            $match: { 
                                $and: [
                                    {request_sent_by: currentUser.uid}
                                ]
                            }
                        }
                    ]
                }
            },
            {
                $lookup: {
                    from: "daterequests",
                    as: "user_daterequests",
                    let: { user_id: "$uid" },
                    foreignField: "request_sent_by",
                    localField: "uid",
                    pipeline: [
                        {
                            $match: { 
                                $and: [
                                    
                                    {request_sent_to: currentUser.uid}
                                ]
                            }
                        }
                    ]
                }
            },
            {
                $addFields: {
                    is_dating: { $in: [currentUser.uid, "$dates"] },
                    has_current_sent_date_request: { $cond: [ { $eq: [{ $size: "$current_user_daterequests" }, 0]}, false, true ] },
                    has_this_user_sent_date_request: { $cond: [ { $eq: [{ $size: "$user_daterequests" }, 0]}, false, true ] }
                }
            },
        ])
        data =  [{   
                    label: "Random Users",
                    items: users.map(user=>{
                        const now = moment(new Date());
                        const birthday = moment(user.birthday);
                        const years = moment.duration(now.diff(birthday)).asYears();
                        user.age =  Math.floor(years);
                        return user
                    })
                }]
        return JSONReponse.success("success", data);
    } catch (error) {
        console.log(error);
        JSONReponse.serverError()
    }
}

export const getQuickChats = async (req: Request, res: Response) => {
    const JSONReponse = new JSONRESPONSE(res);
    const currentUser: UserInterface = res.locals.currentUser;
    try {
        const user_hobbies: string[] = currentUser.hobbies;
        const active_user_obj: ActiveUsers = req.app.locals.active_user_obj;
        const active_users = active_user_obj.active_users;
        const users: UserProfile[] = await User.aggregate([
            {
                $match: {
                    $and: [
                        // {hobbies: { $in: user_hobbies }},
                        {account_setuped: true},
                        {uid: { $ne: currentUser.uid }},
                        {uid: { $in: active_users }}
                    ]
                    
                }
            },
            {
                $lookup: {
                    from: "daterequests",
                    as: "current_user_daterequests",
                    let: { user_id: "$uid" },
                    foreignField: "request_sent_to",
                    localField: "uid",
                    pipeline: [
                        {
                            $match: { 
                                $and: [
                                    {request_sent_by: currentUser.uid}
                                ]
                            }
                        }
                    ]
                }
            },
            {
                $lookup: {
                    from: "daterequests",
                    as: "user_daterequests",
                    let: { user_id: "$uid" },
                    foreignField: "request_sent_by",
                    localField: "uid",
                    pipeline: [
                        {
                            $match: { 
                                $and: [
                                    
                                    {request_sent_to: currentUser.uid}
                                ]
                            }
                        }
                    ]
                }
            },
            {
                $addFields: {
                    is_dating: { $in: [currentUser.uid, "$dates"] },
                    has_current_sent_date_request: { $cond: [ { $eq: [{ $size: "$current_user_daterequests" }, 0]}, false, true ] },
                    has_this_user_sent_date_request: { $cond: [ { $eq: [{ $size: "$user_daterequests" }, 0]}, false, true ] }
                }
            },
        ])
        let flag: boolean = false;
        // const data: ExploreData[] = user_hobbies.map(x=>{
        //     return {
        //         label: "Interested in "+x,
        //         items: users.filter(user=>{
        //             if(user) flag = true;
        //             const now = moment(new Date());
        //             const birthday = moment(user.birthday);
        //             const years = moment.duration(now.diff(birthday)).asYears();
        //             user.age =  Math.floor(years)
        //             return user.hobbies.includes(x)
        //         })
        //     }
        // })
        const data: ExploreData[] = [
        {
            label: "Available Quick Chats",
            items: users.map(user=>{
                if(user) flag = true;
                const now = moment(new Date());
                const birthday = moment(user.birthday);
                const years = moment.duration(now.diff(birthday)).asYears();
                user.age =  Math.floor(years);
                return user
            })
        }]
        
        if(!flag) return JSONReponse.clientError("No Quick Chats Found")
        JSONReponse.success("success", data)
    } catch (error) {
        console.log(error);
        JSONReponse.serverError()
    }
}