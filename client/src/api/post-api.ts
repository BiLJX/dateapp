import { Area } from "react-easy-crop/types";
import axios from "./instance"
import { PicturePostSchema } from "@shared/PicturePost"


export const getPicturesByUid = async (uid: string) => {
    const res = await axios.get("/api/posts/pictures/"+uid);
    return res.data as ApiResponse<PicturePostSchema[]>
}

export const getFeedPictures = async () =>  {
    const res = await axios.get("/api/posts/pictures");
    return res.data as ApiResponse<PicturePostSchema[]>
}

export const postPicture = async (caption: string, picture: File, area: Area) => {
    const formdata = new FormData();
    formdata.append("caption", caption);
    formdata.append("picture", picture);
    formdata.append("x", area.x as any);
    formdata.append("y", area.y as any);
    formdata.append("width", area.width as any);
    formdata.append("height", area.height as any);
    const res = await axios.post("/api/posts/picture/post", formdata)
    return res.data as ApiResponse<PicturePostSchema>
}

export const likePicture = async (post_id: string) => {
    const res = await axios.put("/api/posts/picture/like/"+post_id);
    return res.data as ApiResponse<{}>
}
export const unLikePicture = async (post_id: string) => {
    const res = await axios.put("/api/posts/picture/unlike/"+post_id);
    return res.data as ApiResponse<{}>
}

export const deletePicture = async (post_id: string) => {
    const res = await axios.delete("/api/posts/picture/delete/"+post_id);
    return res.data as ApiResponse<{}>
}