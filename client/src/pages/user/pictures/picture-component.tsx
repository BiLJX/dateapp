import { PicturePostSchema } from "@shared/PicturePost"
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import "./picture-component.css"
import { useState } from "react";
import { likePicture, unLikePicture } from "api/post-api";
import { NavLink } from "react-router-dom";

export function PictureComponentWithHeader({data, close}: {data: PicturePostSchema, close: ()=>any}){
    const [className, setClassName] = useState("")
    const handClose = ()=> {
        setTimeout(()=>{
            close()
        }, 150)
        setClassName("picture-component-close");
    }
    return(
        <div className={`picture-component picture-component-animation ${className}`} style = {{backgroundImage: `url("${data.picture_url}")`}}>
            <div className = "picture-component-header">
                <div className="back-arrow-container" onClick = {handClose}>
                    <ArrowBackIosIcon/>
                </div>
            </div>
            <PictureComponent data = {data} />
        </div>
    )
}

export function PictureItem({data}: {data: PicturePostSchema}){
    return(
        <div className = "picture-component picture-component-feed" style = {{backgroundImage: `url("${data.picture_url}")`}}>
            <PictureComponent data = {data} />
        </div>
    )
}


function PictureComponent({data}: {data: PicturePostSchema}){
    const [hasLiked, setHasLiked] = useState(data.has_liked);
    const [likeCount, setLikeCount] = useState(data.like_count)
    const like = async () => {
        setHasLiked(true)
        setLikeCount(likeCount + 1)
        await likePicture(data.picture_id)
    }
    const unLike = async () => {
        setHasLiked(false)
        setLikeCount(likeCount - 1)
        await unLikePicture(data.picture_id)
    }
    return(
        <div className = "picture-component-main">
            <div className = "picture-component-left">
                <div className = "picture-component-user">
                    <NavLink className = "picture-component-pfp" to = {"/user/"+data.posted_by_uid}>
                        <img src = {data.uploader_data.profile_picture_url} className = "full-img" />
                    </NavLink>
                    <NavLink to = {"/user/"+data.posted_by_uid} className = "picture-component-username ellipsis">{data.uploader_data.username}</NavLink>
                </div>
                <div className = "picture-component-caption">
                    {data.caption}
                </div>
            </div>
            <div className = "picture-component-right">
                {
                    hasLiked?(
                        <div className = "picture-component-like-container like-active" onClick={unLike}>
                            <LocalFireDepartmentIcon />
                            {likeCount}
                        </div>
                    ):(
                        <div className = "picture-component-like-container" onClick = {like}>
                            <LocalFireDepartmentIcon />
                            {likeCount}
                        </div>
                    )
                }
               
            </div>
        </div>
    )
}