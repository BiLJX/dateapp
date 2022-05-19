import { FeedSettingsInterface } from "@shared/Settings";
import { Request, Response } from "express";
import { FeedSettings } from "../models/FeedSettings";
import JSONRESPONSE from "../utils/JSONReponse";


export const getFeedSettings = async (req: Request, res: Response) => {
    const uid = res.locals.uid;
    const JSONResponse = new JSONRESPONSE(res);
    try {
        const settings = await FeedSettings.findOne({uid});
        JSONResponse.success("success", settings?.toJSON());
    } catch (error) {
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
    } catch (error) {
        JSONResponse.serverError()
    }
}