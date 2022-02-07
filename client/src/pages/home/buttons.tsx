import { UserProfile } from '@shared/User'
import { useState } from 'react'
import FavoriteIcon from '@mui/icons-material/Favorite';
import CloseIcon from '@mui/icons-material/Close';
import DoneIcon from '@mui/icons-material/Done';
import { cancelDateRequest, sendDateRequest, unDateUser, acceptDateRequest } from '../../api/date-api';
import { useDispatch } from 'react-redux';
import bannerDispatch from '../../dispatcher/banner';
import  * as bannerActions from "../../action/banner";
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import { saveUser, unsaveUser } from 'api/user-api';

export function SendDateButton({data}: {data: UserProfile}){
    const [hasSentDate, setHasSentDate] = useState(data.has_current_sent_date_request)
    const [hasUserSentDate, setHasUserSentDate] = useState(data.has_this_user_sent_date_request)
    const [isLoading, setIsLoading] = useState(false)
    const [isDating, setIsDating] = useState(data.is_dating)
    const dispatch = useDispatch()
    const sendDate = async () => {
        setHasSentDate(true)
        const res = await sendDateRequest(data.uid);
        if(res.success) return bannerDispatch(dispatch, bannerActions.success(res.msg));
        bannerDispatch(dispatch, bannerActions.error(res.msg))
        setHasSentDate(false)
    }
    const acceptDate = async () => {
        setIsLoading(true)
        const res = await acceptDateRequest(data.uid);
        if(res.success){ 
            bannerDispatch(dispatch, bannerActions.success(res.msg));
            setIsDating(true)
            return
        }
        bannerDispatch(dispatch, bannerActions.error(res.msg))
        setIsLoading(false)
    }
    const cancelDate = async () =>{
        setHasSentDate(false)
        const res = await cancelDateRequest(data.uid);
        if(res.success){ 
            bannerDispatch(dispatch, bannerActions.success(res.msg));
            return
        }
        bannerDispatch(dispatch, bannerActions.error(res.msg))
        setHasSentDate(true)
    }
    const unDate = async () => {
        setIsDating(false);
        setHasSentDate(false);
        setHasUserSentDate(false);
        const res = await unDateUser(data.uid);
        if(!res.success){
            bannerDispatch(dispatch, bannerActions.error(res.msg));
            return setIsDating(true);
        }
        bannerDispatch(dispatch, bannerActions.success(res.msg));
    }
    if(isDating){
        return(
            <div className = "profile-item-button-container profile-item-button-container-heart">
                <div className = "profile-item-button profile-item-heart" onClick = {unDate}>
                    <CloseIcon style = {{position: "relative", bottom: "10%"}} />
                    <span style = {{position: "absolute", color: "var(--text-main)", bottom: "12%", fontSize: "0.8rem"}}>Unmatch</span> 
                </div>
            </div>
        )
    }
    if(hasSentDate){
        return(
            <div className = "profile-item-button-container profile-item-button-container-heart">
                <div className = "profile-item-button profile-item-heart profile-item-button-active" onClick = {cancelDate}>
                    <FavoriteIcon />
                </div>
            </div>
        )
    }
    if(hasUserSentDate){
        return(
            <div className = "profile-item-button-container profile-item-button-container-heart">
                <div className = "profile-item-button profile-item-accept" onClick = {acceptDate}>
                    { isLoading?"wait":<DoneIcon />}
                </div>
            </div>
        )
    }
    return(
        <div className = "profile-item-button-container profile-item-button-container-heart">
            <div className = {`profile-item-button profile-item-heart`} onClick = {sendDate}>
                <FavoriteIcon />
            </div>
        </div>
    )
}


export function SaveButton({data}: {data: UserProfile}){
    const [hasSaved, setHasSaved] = useState(data.has_saved);
    const dispatch = useDispatch()
    const save = async () => {
        setHasSaved(true);
        const res = await saveUser(data.uid);
        if(res.success){
            return;
        }
        bannerDispatch(dispatch, bannerActions.error(res.msg));
        return setHasSaved(false)
    }
    const unSave = async () => {
        setHasSaved(false);
        const res = await unsaveUser(data.uid);
        if(res.success){
            return;
        }
        bannerDispatch(dispatch, bannerActions.error(res.msg));
        return setHasSaved(true)
    }
    if(hasSaved){
        return(
            <div className = "profile-item-button-container">
                <div className = "profile-item-button profile-item-cross" onClick={unSave}>
                    <BookmarkIcon />
                </div>
            </div>
        )
    }
    return(
        <div className = "profile-item-button-container">
            <div className = "profile-item-button profile-item-cross" onClick={save}>
                <BookmarkBorderIcon />
            </div>
        </div>
    )
}