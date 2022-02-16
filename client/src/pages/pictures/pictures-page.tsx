import { PicturePostSchema } from "@shared/PicturePost"
import { getFeedPictures } from "api/post-api";
import { HeartLoader } from "global-components/loaders/loaders";
import { PictureItem } from "pages/user/pictures/picture-component";
import { useEffect, useState } from "react";
import "./pictures-page.css"
export default function PicturePage(){
    const [pictures, setPictures] = useState<PicturePostSchema[]>([]);
    const [isLoading, setIsLoading] = useState(true)
    const getPictures = async () => {
        const res = await getFeedPictures();
        if(res.success){
            setPictures(res.data)
        }
        setIsLoading(false)
    }
    useEffect(()=>{
        getPictures()
    }, [])
    if(isLoading) return <HeartLoader />
    if(pictures.length === 0){
        return(
            <div className="full error-page">
                <h1>Your'e Dates Have not uploaded any pictures yet.</h1>
            </div>
        )
    }
    return(
        <div className="pictures-page">
            <div className = "pictures-container">
                {pictures.map((data, i)=>(
                    <PictureItem data = {data} key = {i} />
                ))}
            </div>
        </div>
    )
}