import { FeedSettingsInterface } from "@shared/Settings";
import { Request, Response } from "express";
import { FeedSettings } from "../models/FeedSettings";
import JSONRESPONSE from "../utils/JSONReponse";
import { redis_client } from "../redis-client";

export const getFeedSettings = async (req: Request, res: Response) => {
    const uid = res.locals.uid;
    const JSONResponse = new JSONRESPONSE(res);
    
    try {
        const cached_settings = JSON.parse(await redis_client.get(uid+"_feed_settings")||"{}");
        if(cached_settings.uid) return JSONResponse.success("success", cached_settings);
        const settings = await FeedSettings.findOne({uid});
        JSONResponse.success("success", settings?.toJSON());
        await redis_client.set(uid+"_feed_settings", JSON.stringify(settings?.toJSON()))
    } catch (error) {
        console.log(error)
        JSONResponse.serverError()
    }
}

export const updateFeedSettings = async (req: Request, res: Response) => {
    const uid = res.locals.uid;
    const JSONResponse = new JSONRESPONSE(res);
    try {
        const client_settings: FeedSettingsInterface = req.body;
        client_settings.uid = uid;
        await FeedSettings.findOneAndUpdate({uid}, { $set: client_settings });
        JSONResponse.success();
        await redis_client.set(uid+"_feed_settings", JSON.stringify(client_settings))
    } catch (error) {
        console.log(error)
        JSONResponse.serverError()
    }
}