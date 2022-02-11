import { UserProfile } from "@shared/User";
import { getUserByUid } from "api/user-api";
import { ContainerWithHeader, Header } from "global-components/containers/container-with-header";
import { SpinLoader } from "../../global-components/loaders/loaders"
import { useEffect, useState } from "react";
import { NavLink, Route, Routes, useParams } from "react-router-dom";
import EditIcon from '@mui/icons-material/Edit';
import "./user.css";
import UserProfileAbout from "./user-profile-about";
import UserProfilePicturesPage from "./user-profile-pictures";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
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
                        {!isViewersProfile&&<Buttons />}
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

function Buttons(){
    return(
        <div className="user-profile-buttons-container">
            <SaveButton />
            <DateButton />
            <ChatButton />
        </div>
    )
}

function SaveButton(){
    return(
        <div className = "user-profile-button" style = {{ backgroundColor: "var(--dark-pink)" }}>
            <BookmarkBorderIcon />
        </div>
    )
}

function DateButton(){
    return(
        <div className = "user-profile-button">
            <FavoriteBorderIcon />
        </div>
    )
}

function ChatButton(){
    return(
        <div className = "user-profile-button" style = {{ backgroundColor: "var(--blue)" }}>
            <SendOutlinedIcon />
        </div>
    )
}