import { useSelector } from "react-redux"
import { Route, Routes, useNavigate, useParams } from "react-router-dom";
import { RootState } from "types/states"
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import "./user-pictures.css"
import PictureForm from "./picture-form";
import { useEffect, useState } from "react";
import { PicturePostSchema } from "@shared/PicturePost";
import { getPicturesByUid } from "api/post-api";
import {PictureComponentWithHeader} from "./picture-component";
export default function UserProfilePicturesPage(){
    const [showForm, setShowForm] = useState(false);
    const [pictures, setPictures] = useState<PicturePostSchema[]>([]);
    const user = useSelector((state: RootState)=>state.current_user);
    const { uid } = useParams()
    const getPictures = async () => {
        if(!uid) return
        const res = await getPicturesByUid(uid);
        if(res.success){
            setPictures(res.data)
        }
    }
    useEffect(()=>{
        getPictures()
    }, [])

    return(
        <>
            {showForm && <PictureForm onData={(data)=>setPictures((prev)=>[data, ...prev])} close = {()=>setShowForm(false)} />}
            <div className="user-profile-picture-grid">
                {user?.uid === uid && <AddPicture onClick = {()=>setShowForm(true)} /> }
                {pictures.map((x, i)=>(
                    <Picture data =  {x} key = {i}/>
                ))}
            </div>               
        </>
    )
}


function AddPicture({onClick}: {onClick: ()=>any}){
    return(
        <div className = "user-profile-picture add-picture" onClick={onClick} >
            <div className="user-profile-picture-addpicture-wrapper">
                <AddAPhotoIcon />
            </div>
        </div>
    )
}

function Picture({data}: {data: PicturePostSchema}){
    const navigate = useNavigate()
    return(
        <div className = "user-profile-picture" onClick={()=>navigate("/pictures/"+data.picture_id)}>
            <img className="full-img user-profile-picture-img" src = {data.picture_url}/>
        </div>
    )
}