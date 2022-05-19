import { PicturePostSchema } from "@shared/PicturePost"
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import "./picture-component.css"
import { useEffect, useState } from "react";
import { deletePicture, getPictureById, likePicture, unLikePicture } from "api/post-api";
import { NavLink, useLocation, useNavigate, useParams } from "react-router-dom";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import Modal from "react-modal"
import { useSelector } from "react-redux";
import { RootState } from "types/states";
import { toastError, toastSuccess } from "dispatcher/banner";
export function PictureComponentWithHeader(){
    const location = useLocation();
    const [data, setData] = useState<PicturePostSchema>(location.state as PicturePostSchema);
    const params = useParams();
    const navigate = useNavigate()
    
    useEffect(()=>{
        if(!data) getPictureById(params.id||"").then(data=>setData(data.data));
        return(()=>{location.state = null});
    }, []);
    if(!data) return(
        <div className={`picture-component picture-component-animation`}>
            <div className = "picture-component-header">
                <div className="back-arrow-container" onClick = {()=>navigate(-1)}>
                    <ArrowBackIosIcon/>
                </div>
            </div>

        </div>
    )
    return(
        <div className={`picture-component ${!location.state?"":"picture-component-animation"}`} style = {{backgroundImage: `url("${data.picture_url}")`}}>
            <div className = "picture-component-header">
                <div className="back-arrow-container" onClick = {()=>navigate(-1)}>
                    <ArrowBackIosIcon/>
                </div>
            </div>
            <PictureComponent data = {data}/>
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


function PictureComponent({data, close, onPictureRemove}: {data: PicturePostSchema, close?:any, onPictureRemove?:(pic_id: string)=>any}){
    const [hasLiked, setHasLiked] = useState(data.has_liked);
    const [likeCount, setLikeCount] = useState(data.like_count);
    const [isOpen, setIsOpen] = useState(false);
    const [deleting, setIsDeleting] = useState(false);
    const [deleted, setDeleted] = useState(false)
    const currentUser = useSelector((state: RootState)=>state.current_user);
    const navigate = useNavigate()
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
    const deletePic = async () => {
        setIsDeleting(true);
        const res = await deletePicture(data.picture_id);
        if(res.success) {
            toastSuccess("successfully deleleted");
            setDeleted(true);
            setIsDeleting(false);
            navigate(-1);
            close();
            return;
        }
        toastError(res.msg)
        setIsDeleting(false)
    }
    const openOptions = () => {
        setIsOpen(true)
    }
    const closeOptions = () => {
        setIsOpen(false)
    }
    if(deleted) return <></>;
    return(
        <div className = "picture-component-main">
            <Modal 
            isOpen = {isOpen}
            className = "picture-options-modal"
            overlayClassName="picture-options-overlay"
            >
                {hasLiked?<div className = "picture-option" onClick={unLike}>Unike</div>:<div className = "picture-option" onClick={like}>Like</div>}
                {currentUser?.uid===data.posted_by_uid?<div className = "picture-option" onClick={deleting?()=>null:deletePic}>{deleting? "deleting..." :"Delete"}</div>:null}
                <div className = "picture-option" onClick={closeOptions}>Cancel</div>
            </Modal>
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
                <div className="picture-component-options" onClick={openOptions}>
                    <MoreHorizIcon />
                </div>
               
            </div>
        </div>
    )
}

