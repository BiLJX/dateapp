import { UserProfile } from "@shared/User";
import { getUserByUid } from "api/user-api";
import { ContainerWithHeader, Header } from "global-components/containers/container-with-header";
import { SpinLoader } from "../../global-components/loaders/loaders"
import { useEffect, useState } from "react";
import { NavLink, Route, Routes, useParams, useNavigate } from "react-router-dom";
import { saveUser, unsaveUser } from "api/user-api"
import EditIcon from '@mui/icons-material/Edit';
import "./user.css";
import UserProfileAbout from "./user-profile-about";
import UserProfilePicturesPage from "./user-profile-pictures";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from "@mui/icons-material/Bookmark"
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import FavoriteIcon from '@mui/icons-material/Favorite';
import HeartBrokenOutlinedIcon from '@mui/icons-material/HeartBrokenOutlined';
import DoneIcon from '@mui/icons-material/Done';
import * as dateApi from "../../api/date-api"
import { useSelector } from "react-redux";
import { RootState } from "types/states";

export default function UserProfilePage(){
    const currentUser = useSelector((state: RootState)=>state.current_user);
    const [user, setUser] = useState<UserProfile>();
    const [isLoading, setIsLoading] = useState(true)
    const { uid } = useParams()
    const isViewersProfile = uid === currentUser?.uid;
    const getUser = async () => {
        if(!uid) return
        const response = await getUserByUid(uid);
        if(response.success){
            setUser(response.data);
        }
        setIsLoading(false)
    }
    useEffect(()=>{
        getUser()
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
            <Header name={ user.username } goBackButton />
            <ContainerWithHeader>
                <div className="user-profile-page">
                    <div className="user-profile-page-background">
                        <img className="full-img" src = {user.profile_picture_url} />
                    </div>
                    <div className = "user-profile-contents-container">
                        {!isViewersProfile&&<Buttons user = {user} />}
                        <div className="user-profile-contents-header">
                            <h1 className="user-profile-name ellipsis-clamp">{user.full_name} ({user.age})</h1>
                            {isViewersProfile && <NavLink to = "/profile/edit" className = "user-profile-edit"><EditIcon /></NavLink>}
                        </div>
                        
                        <div className = "user-profile-nav">
                            <NavLink end to = "" className={(state)=>!state.isActive?"user-profile-nav-item":"user-profile-nav-item user-profile-nav-item-active"}>
                                About
                            </NavLink>
                            <NavLink to = "pictures" className={(state)=>!state.isActive?"user-profile-nav-item":"user-profile-nav-item user-profile-nav-item-active"}>
                                Pictures
                            </NavLink>
                        </div>
                        <div className = "user-profile-contents-main">
                            <Routes>
                                <Route index={true} element = {<UserProfileAbout user = {user} />} />
                                <Route path = "pictures" element =  {<UserProfilePicturesPage />} />
                            </Routes>
                        </div>
                    </div>
                </div>
            </ContainerWithHeader>
        </>
    )
}

function Buttons({user}: {user: UserProfile}){
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