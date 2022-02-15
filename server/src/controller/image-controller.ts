import { async } from "@firebase/util";
import { Request, Response } from "express";
import JSONRESPONSE from "../utils/JSONReponse";
import { upload, uploadFile } from "../utils/upload";
import sharp from "sharp"
import { User } from "../models/User";
interface CropInfoClient {
    x: string,
    y: string,
    width: string,
    height: string
}

interface CropInfo {
    left: number,
    top: number,
    width: number,
    height: number
}
export const uploadPfp = async (req: Request, res: Response) => {
    upload(req, res, async (err)=>{
        const JSONReponse = new JSONRESPONSE(res);
        if(err){
            console.log(err);
            return JSONReponse.serverError()
        }
        try{
            const uid = res.locals.uid;
            const file: any = req.files;
            const pfp = file[0];
            const buffer = pfp.buffer
            const vals: CropInfoClient = req.body;
            if (!pfp.mimetype.includes("image")) return JSONReponse.clientError("invalid file type")
            const cropInfo: CropInfo = {
                left: parseFloat(vals.x || "0"),
                top: parseFloat(vals.y || "0"),
                width: parseFloat(vals.width || "0"),
                height: parseFloat(vals.height || "0"),
            }
            const meta = await sharp(buffer).metadata();
            if(!meta.height || !meta.width) return JSONReponse.clientError("something went wrong");
            cropInfo.top = Math.round((cropInfo.top / 100) * meta.height);
            cropInfo.left = Math.round((cropInfo.left / 100) * meta.width);
            cropInfo.width = Math.round((cropInfo.width / 100) * meta.width);
            cropInfo.height = Math.round((cropInfo.height / 100) * meta.height);
            const imgBuffer = await sharp(buffer).extract(cropInfo).resize(450, 800).jpeg().toBuffer()
            const url = await uploadFile(imgBuffer, `user/${uid}/pfp/`)
            await User.findOneAndUpdate({uid}, { $set: { profile_picture_url: url } });
            JSONReponse.success("success", { url })
        }catch(err){
            console.log(err);
            JSONReponse.serverError()
        }
    })
}
export const uploadCover = async (req: Request, res: Response) => {
    upload(req, res, async (err)=>{
        const JSONReponse = new JSONRESPONSE(res);
        if(err){
            console.log(err);
            return JSONReponse.serverError()
        }
        try{
            const uid = res.locals.uid;
            const file: any = req.files;
            const pfp = file[0];
            const buffer = pfp.buffer
            const vals: CropInfoClient = req.body;
            if (!pfp.mimetype.includes("image")) return JSONReponse.clientError("invalid file type")
            const cropInfo: CropInfo = {
                left: parseFloat(vals.x || "0"),
                top: parseFloat(vals.y || "0"),
                width: parseFloat(vals.width || "0"),
                height: parseFloat(vals.height || "0"),
            }
            const meta = await sharp(buffer).metadata();
            if(!meta.height || !meta.width) return JSONReponse.clientError("something went wrong");
            cropInfo.top = Math.round((cropInfo.top / 100) * meta.height);
            cropInfo.left = Math.round((cropInfo.left / 100) * meta.width);
            cropInfo.width = Math.round((cropInfo.width / 100) * meta.width);
            cropInfo.height = Math.round((cropInfo.height / 100) * meta.height);
            const imgBuffer = await sharp(buffer).extract(cropInfo).resize(450, 800).jpeg().toBuffer()
            const url = await uploadFile(imgBuffer, `user/${uid}/cover/`)
            await User.findOneAndUpdate({uid}, { $set: { cover_picture_url: url } });
            JSONReponse.success("success", { url })
        }catch(err){
            console.log(err);
            JSONReponse.serverError()
        }
    })
}