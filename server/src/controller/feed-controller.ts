import { UserInterface, UserProfile } from "@shared/User";
import { Request, Response } from "express";
import { Match } from "../algorithm/FindMatch";
import { User } from "../models/User";
import JSONRESPONSE from "../utils/JSONReponse"
import { parseUser } from "./user-controller";

export const getFeed = async (req: Request, res: Response) => {
    const JSONReponse = new JSONRESPONSE(res);
    const currentUser: any = res.locals.currentUser;
    const page: number = parseInt(<string>req.query.page)||1;
    try {
        if(page<1) return JSONReponse.clientError("page cannot be leses than 1");
        const items: number = 10;
        const total_items = page * items;
        const users = await User
                            .find({account_setuped: true, uid: { $ne: currentUser.uid }})
                            .sort({updatedAt: 'desc'})
                            .limit(100)
                            .lean()
                            .exec()
        const algo = new Match(currentUser, users);
        algo.calcScore();
        algo.sort();
        const matches = algo.matching_users;
        const matching_users = await User
                            .aggregate([
                                {$match: {
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
        const parsed_users: UserProfile[] = await Promise.all(matching_users.map(async x=>parseUser(x, res.locals.currentUser))) 
        JSONReponse.success("success", parsed_users)
    } catch (error) {
        console.log(error);
        JSONReponse.serverError()
    }

}