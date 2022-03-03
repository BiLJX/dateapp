import React from "react"
import { HobbySchema, UserProfile } from "@shared/User";
import { getUserByUid } from "api/user-api";
import { Header } from "global-components/containers/container-with-header";
import { SpinLoader } from "../../global-components/loaders/loaders"
import { useEffect, useState } from "react";
import { NavLink, Route, Routes, useParams, useNavigate } from "react-router-dom";
import { saveUser, unsaveUser } from "api/user-api"
import EditIcon from '@mui/icons-material/Edit';
import ImageIcon from '@mui/icons-material/Image';
import "./user.css";
import UserProfileAbout from "./user-profile-about";
import UserProfilePicturesPage from "./pictures/user-profile-pictures";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from "@mui/icons-material/Bookmark"
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import FavoriteIcon from '@mui/icons-material/Favorite';
import HeartBrokenOutlinedIcon from '@mui/icons-material/HeartBrokenOutlined';
import DoneIcon from '@mui/icons-material/Done';
import * as dateApi from "../../api/date-api"
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "types/states";
import DefaultBackground  from "./default.jpeg"
import Crop from "global-components/crop/crop-component";
import { addCurrentUser } from "action/user";
import UserInterestsPage from "./interests/user-interests";
import { getUserHobby } from "api/hobby-api";

export default function UserProfilePage(){
    const currentUser = useSelector((state: RootState)=>state.current_user);
    const dispatch = useDispatch()
    const [user, setUser] = useState<UserProfile>();
    const [opacity, setOpacity] = useState(1)
    const [isLoading, setIsLoading] = useState(true)
    const [blur, setBlur] = useState(0)
    const [cover_img_url, setCover_img_url] = useState("")
    const [cover_img, setCover_img] = useState<File>();
    const [cropper, setCropper] = useState(false)
    const [hobbies, setHobbies] = useState<HobbySchema[]>([])

    const { uid } = useParams()
    const isViewersProfile = uid === currentUser?.uid;
    const getUser = async () => {
        if(!uid) return
        if(isViewersProfile && currentUser){
            setUser(currentUser);
            setCover_img_url(currentUser.cover_picture_url ||DefaultBackground);
            return setIsLoading(false)
        }
        const response = await getUserByUid(uid);
        const hobbies_res = await getUserHobby(uid);
        if(hobbies_res.success){
            setHobbies(hobbies_res.data)
        }
        if(response.success){
            setUser(response.data);
            setCover_img_url(response.data.cover_picture_url ||DefaultBackground);
        }
        setIsLoading(false)
    }
    const scroll = (e: any) => {
        const scrollHeight = document.documentElement.scrollHeight
        const ratio = window.scrollY/scrollHeight
        const opacity = 1-(ratio * 2)
        const blur = ratio * 20
        setOpacity(opacity)
        setBlur(blur)
    }

    const onUploaded = (url: string) => {
        setCover_img_url(url);
        dispatch(addCurrentUser({...currentUser as any, cover_picture_url: url}))
        setCropper(false)
    }
    const onCoverChange = (e: any) => {
        setCover_img(e.target.files[0])
        setCropper(true)
    }

    useEffect(()=>{
        getUser()
        window.removeEventListener('scroll', scroll);
        window.addEventListener('scroll', scroll, { passive: true });
        return () => window.removeEventListener('scroll', scroll);
    }, [])

    if(isLoading) return (<><Header name = "Profile" goBackButton /><SpinLoader /></>)

    if(!user || !uid){
        return(
            <>
                <Header name="not found" goBackButton/>
                <div className="full error-page">
                    <h1>User Not Found</h1>
                </div>
            </>
        )
    }
    return(
        <>
            { cropper && <Crop image={ cover_img as File } type = "COVER" on_reject={()=>setCropper(false)} on_complete = {onUploaded} /> }
            <Header className="profile-header" name={ user.username } goBackButton goBackTo={"/"} />
            <div className="user-profile-page">
                <div className="user-profile-page-background"style={{backgroundImage: `url("${cover_img_url}")`, opacity: opacity, filter: `blur(${blur}px)`}}>
                    <div className = "user-profile-pfp">
                        <img src = { user.profile_picture_url } className = "full-img" />
                    </div>
                    <h1 className="user-profile-name ellipsis-clamp">{user.full_name} ({user.age})</h1>
                        <Buttons onChange={onCoverChange} user = {user} isViewer = {isViewersProfile} />
                </div>
                <div className = "user-profile-contents-container">
                    <div className="user-profile-contents-header">
                       
                    </div>
                    
                    <div className = "user-profile-nav">
                        <NavLink end to = "" className={(state)=>!state.isActive?"user-profile-nav-item":"user-profile-nav-item user-profile-nav-item-active"}>
                            About
                        </NavLink>
                        <NavLink to = "interests" className={(state)=>!state.isActive?"user-profile-nav-item":"user-profile-nav-item user-profile-nav-item-active"}>
                            Interests
                        </NavLink>
                        <NavLink to = "pictures" className={(state)=>!state.isActive?"user-profile-nav-item":"user-profile-nav-item user-profile-nav-item-active"}>
                            Pictures
                        </NavLink>
                    </div>
                    <div className = "user-profile-contents-main">
                        <Routes>
                            <Route index={true} element = {<UserProfileAbout user = {user} />} />
                            <Route path = "interests" element = {<UserInterestsPage user={user} />} />
                            <Route path = "pictures" element =  {<UserProfilePicturesPage />} />
                        </Routes>
                    </div>
                </div>
            </div>
        </>
    )
}

function Buttons({user, isViewer = false, onChange}: {user: UserProfile, isViewer?: boolean, onChange: (e: any)=>any}){
    if(isViewer){
        return(
            <div className="user-profile-buttons-container" style = {{justifyContent: "center"}}>
                
                <NavLink to = "/profile/edit" className = "user-profile-button">
                    <EditIcon />
                </NavLink>
                <input hidden id = "user-profile-cover-input" type = "file" accept="image/*" onChange={onChange} />
                <label htmlFor = "user-profile-cover-input" className = "user-profile-button" style =  {{marginLeft: "10%", backgroundColor: "var(--blue)"}}>
                    <ImageIcon />
                </label>
            </div>
        )
    }
    return(
        <div className="user-profile-buttons-container">
            <SaveButton user = {user} />
            <DateButton user = {user} />
            <ChatButton user = {user} />
        </div>
    )
}

function SaveButton({user}: {user: UserProfile}){
    const [hasSaved, setHasSaved] = useState(user.has_saved)
    const save = async () => {
        setHasSaved(true)
        const res = await saveUser(user.uid);
        if(!res.success){
            setHasSaved(false)
        }
    }
    const unSave = async () => {
        setHasSaved(false);
        const res = await unsaveUser(user.uid);
        if(!res.success){
            setHasSaved(true);
        }
    }
    if(hasSaved){
        return(
            <div className = "user-profile-button" style = {{ backgroundColor: "var(--dark-pink)" }} onClick = {unSave}>
                <BookmarkIcon />
            </div>
        )
    }
    return(
        <div className = "user-profile-button" style = {{ backgroundColor: "var(--dark-pink)" }} onClick = {save}>
            <BookmarkBorderIcon />
        </div>
    )
}

function DateButton({user}: {user: UserProfile}){
    const [hasViewerSentDate, setHasViewerSentDate] = useState(user.has_current_sent_date_request);
    const [hasUserSentDate, setHasUserSentDate] = useState(user.has_this_user_sent_date_request);
    const [isDating, setIsDating] = useState(user.is_dating);
    
    const sendDateRequest = async () => {
        setHasViewerSentDate(true);
        const res = await dateApi.sendDateRequest(user.uid);
        if(!res.success) return setHasViewerSentDate(false)
    }

    const cancelDateRequest = async () => {
        setHasViewerSentDate(false);
        const res = await dateApi.cancelDateRequest(user.uid);
        if(!res.success) return setHasViewerSentDate(true)
    }

    const acceptDateRequest = async () => {
        setHasUserSentDate(false);
        setIsDating(true);
        const res = await dateApi.acceptDateRequest(user.uid);
        if(!res.success){
            setHasUserSentDate(true)
            setIsDating(false)
        }
    }

    const unDate = async () => {
        setIsDating(false);
        const res = await dateApi.unDateUser(user.uid);
        if(!res.success){
            setIsDating(true)
        }
    }

    if(hasUserSentDate){
        return(
            <div className = "user-profile-button" onClick={acceptDateRequest}>
                <DoneIcon />
            </div>
        )
       
    }
    if(isDating){
        return(
            <div className = "user-profile-button" onClick={unDate}>
                <HeartBrokenOutlinedIcon />
            </div>
        )
    }
    if(hasViewerSentDate){
        return(
            <div className = "user-profile-button" onClick = {cancelDateRequest}>
                <FavoriteIcon />
            </div>
        )
    }
    return(
        <div className = "user-profile-button" onClick={sendDateRequest}>
            <FavoriteBorderIcon />
        </div>
    )
}

function ChatButton({user}: {user: UserProfile}){
    const navigate = useNavigate()
    if(!user.is_dating){
        return(
            <div 
            className = "user-profile-button" 
            style = {{ backgroundColor: "var(--blue-disabled)" }} 
            >
                <SendOutlinedIcon />
            </div>
        )    
    }
    return(
        <div 
            className = "user-profile-button" 
            style = {{ backgroundColor: "var(--blue)" }} 
            onClick = {()=>user.is_dating && navigate("/message/"+user.uid)}
        >
            <SendOutlinedIcon />
        </div>
    )
}