import { FeedSettingsInterface } from "@shared/Settings";
import { UserInterface, UserProfile } from "@shared/User";
import { Request, Response } from "express";
import { addDateRequest } from "../aggregation/user-aggregation";
import { Match } from "../algorithm/FindMatch";
import { DateRequest } from "../models/DateRequest";
import { FeedSettings } from "../models/FeedSettings";
import { User } from "../models/User";
import { redis_client } from "../redis-client";
import JSONRESPONSE from "../utils/JSONReponse"
import { parseUser } from "./user-controller";

interface FeedCache {
    feed: string[];
    is_finding: boolean
}
const projection = {
    $project: {
        date_requests: 0,
        notifications: 0,
        feed_settings: 0,
        email: 0,
        createdAt: 0,
        hobbies: 0,
        saved_users: 0,
        updatedAt: 0,
        account_setuped: 0,
        user_daterequests: 0,
        current_user_daterequests: 0
    }
}
export const getFeed = async (req: Request, res: Response) => {
    const JSONReponse = new JSONRESPONSE(res);
    const currentUser: any = res.locals.currentUser;
    const page: number = parseInt(<string>req.query.page)||1;
    const REDIX_KEY = currentUser.uid+"_feed";
    const findMatches = async () => {
        const users = await User
        .find({account_setuped: true, uid: { $ne: currentUser.uid }})
        .sort({updatedAt: 'desc'})
        .limit(100)
        .lean()
        .exec()
        const algo = new Match(currentUser, users);
        algo.calcScore();
        algo.sort();
        return algo.matching_users;
    }
    try {
        if(page<1) return JSONReponse.clientError("page cannot be leses than 1");
        
        const items: number = 10;
        const total_items = page * items;
        let cached_feed: FeedCache = JSON.parse(await redis_client.get(REDIX_KEY) || "[]")
        let matches = cached_feed.feed||[];
        
        if(matches.length === 0) matches = await findMatches()
        let settings: FeedSettingsInterface = JSON.parse( await redis_client.get(currentUser.uid+"_feed_settings") || "{}" );
        if(!settings.uid) settings = <FeedSettingsInterface>(await FeedSettings.findOne({uid: currentUser.uid}))?.toJSON()
        
        const matching_users = await User
                            .aggregate([
                                {
                                    $match: {
                                        $and: [
                                            {uid: {$in: matches}},
                                            {account_setuped: true},
                                            {$or: [{ gender: settings.gender_filter === "any"?"male": settings.gender_filter }, { gender: settings.gender_filter === "any"?"female":settings.gender_filter }]}
                                        ]
                                    }
                                },
                                {
                                    $addFields: {
                                        "__order": {$indexOfArray: [matches, "$uid" ]},
                                    }
                                },
                                { $sort: {"__order": 1} },
                                { $skip: total_items-items },
                                { $limit: items },
                                {
                                    $lookup: {
                                        from: "feedsettings",
                                        localField: "uid",
                                        foreignField: "uid",
                                        as: "feed_settings"
                                    }
                                },
                                {
                                    $match: {
                                        $or: [
                                            {
                                                "feed_settings.looking_for": settings.looking_for === "any"?"relationship":settings.looking_for
                                            },
                                            {
                                                "feed_settings.looking_for": settings.looking_for === "any"?"friendship":settings.looking_for
                                            },
                                            {
                                                "feed_settings.looking_for": settings.looking_for === "any"?"any":settings.looking_for
                                            },
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
                                projection
                            ])
                            .exec()
                      
        const tasks = matching_users.map(async x=>parseUser(x, res.locals.currentUser))
        const parsed_users: UserProfile[] = await Promise.all(tasks) 
        let final_users = settings.show_your_dates?parsed_users.filter(x=>!x.is_dating):parsed_users
        final_users = final_users.filter(x=>x.age>=settings.age_range.min && x.age<=settings.age_range.max)
        JSONReponse.success("success", final_users)
        const cached_feed_data: FeedCache = {
            feed: await findMatches(),
            is_finding: false
        }
        await redis_client.set(REDIX_KEY, JSON.stringify(cached_feed_data))
    } catch (error) {
        console.log(error);
        JSONReponse.serverError()
    }

}