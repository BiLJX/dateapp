import { PicturePostSchema } from "@shared/PicturePost";
import { UserInterface } from "@shared/User";
import { Request, Response } from "express";
import { UserDate } from "../models/Dates";
import { PicturePost } from "../models/PicturePost";
import { uuid } from "../utils/idgen";
import JSONRESPONSE from "../utils/JSONReponse";
import { cropPicture, upload, uploadFile } from "../utils/upload";

const parsePicture = async (post: PicturePostSchema, currentUser: UserInterface) => {
    post.has_liked = post.liked_by.includes(currentUser.uid);
    post.like_count = post.liked_by.length;
    return post
}

export const getUsersPictures = async (req: Request, res: Response) => {
    const JSONResponse = new JSONRESPONSE(res);
    const uid = req.params.uid
    const currentUser: UserInterface = res.locals.currentUser
    try{
        const pictures = await PicturePost
                                .find({posted_by_uid: uid})
                                .populate("uploader_data", "uid username profile_picture_url")
                                .sort({createdAt: 'desc'})
                                .lean()
                                .exec()
        const parsed_pictures = await Promise.all(pictures.map(pic=>parsePicture(pic, currentUser))) 
        JSONResponse.success("success", parsed_pictures)
    }catch(err){
        console.log(err)
        JSONResponse.serverError()
    }
}

export const getFeedPictures = async (req: Request, res: Response) => {
    const JSONResponse = new JSONRESPONSE(res);
    const user: UserInterface = res.locals.currentUser;
    try{
        const user_dates_obj = await UserDate.find({uid: user.uid}).lean().exec();
        const user_dates = user_dates_obj.map(x=>x.date_user_uid);
        const pictures = await PicturePost
                            .find({ posted_by_uid: { $in: user_dates } })
                            .populate("uploader_data", "uid username profile_picture_url")
                            .sort({createdAt: 'desc'})
                            .lean()
                            .exec()
        const parsed_pictures = await Promise.all(pictures.map(pic=>parsePicture(pic, user)));
        JSONResponse.success("success", parsed_pictures)
    }catch(err){
        console.log(err)
        JSONResponse.serverError()
    }
}

export const postPicture = async (req: Request, res: Response) => {
    const JSONResponse = new JSONRESPONSE(res);
    const user: UserInterface = res.locals.currentUser
    upload(req, res, async err=>{
        if(err) return JSONResponse.serverError();
        try {
            const data = req.body;
            const files: any  = req.files;
            const picture = files[0];
            const picture_id: string = uuid()
            if(data.caption?.length > 50) return JSONResponse.clientError("Max caption length is 20 charecters");
            if(!data.caption) return JSONResponse.clientError("Enter caption")
            data.caption = data.caption.trim() 
            if(!files || !picture) return JSONResponse.clientError("file not uploaded");
            if (!picture.mimetype.includes("image")) return JSONResponse.clientError("invalid file type")
            const area = {
                x: data.x,
                y: data.y,
                width: data.width,
                height: data.height
            }
            const cropped_img = await cropPicture(picture.buffer, area, [1200, 2133]);
            const url = await uploadFile(cropped_img, `user/${user.uid}/pictures/`, false);
            const post = new PicturePost({
                caption: data.caption,
                picture_id,
                posted_by_uid: user.uid,
                picture_url: url
            })
            const saved = (await post.save()).toJSON();
            saved.uploader_data = {
                username: user.username,
                profile_picture_url: user.profile_picture_url,
                uid: user.uid
            }
            JSONResponse.success("success", await parsePicture(saved, user))
        } catch (error) {
            console.log(error);
            JSONResponse.serverError()
        }
    })
}


export const like = async (req: Request, res: Response) => {
    const JSONResponse = new JSONRESPONSE(res);
    const user: UserInterface = res.locals.currentUser;
    const picture_id: string = req.params.id;
    if(!picture_id) return JSONResponse.notFound()
    try{
        const post = await PicturePost.findOne({picture_id});
        if(!post) return JSONResponse.notFound()
        if(post.liked_by.includes(picture_id)) return JSONResponse.clientError("you have already liked this post");
        await PicturePost.findOneAndUpdate({ picture_id }, { $push: { liked_by: user.uid } });
        JSONResponse.success()
    }catch(err){
        console.log(err);
        JSONResponse.serverError()
    }
}

export const unLike = async (req: Request, res: Response) => {
    const JSONResponse = new JSONRESPONSE(res);
    const user: UserInterface = res.locals.currentUser;
    const picture_id: string = req.params.id;
    try{
        const post = await PicturePost.findOne({picture_id});
        if(!post) return JSONResponse.notFound()
        if(!post.liked_by.includes(user.uid)) return JSONResponse.clientError("you havent liked the post");
        await PicturePost.findOneAndUpdate({ picture_id }, { $pull: { liked_by: user.uid } });
        JSONResponse.success()
    }catch(err){
        console.log(err);
        JSONResponse.serverError()
    }
}