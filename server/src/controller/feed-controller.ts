import { UserInterface, UserProfile } from "@shared/User";
import { Request, Response } from "express";
import { Match } from "../algorithm/FindMatch";
import { DateRequest } from "../models/DateRequest";
import { User } from "../models/User";
import { redis_client } from "../redis-client";
import JSONRESPONSE from "../utils/JSONReponse"
import { parseUser } from "./user-controller";

interface FeedCache {
    feed: string[];
    is_finding: boolean
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
        
        const matching_users = await User
                            .aggregate([
                                {
                                    $match: {
                                        $and: [
                                            {uid: {$in: matches}},
                                            {account_setuped: true}
                                        ]
                                    }
                                },
                                {$addFields: {"__order": {$indexOfArray: [matches, "$uid" ]}}},
                                {$sort: {"__order": 1}}
                            ])
                            .skip(total_items-items)
                            .limit(items)
                            .exec()
        const tasks = matching_users.map(async x=>parseUser(x, res.locals.currentUser))
        const parsed_users: UserProfile[] = await Promise.all(tasks) 
        JSONReponse.success("success", parsed_users)
        
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