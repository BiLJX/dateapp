import { UserProfile } from '@shared/User'
import { useState } from 'react'
import FavoriteIcon from '@mui/icons-material/Favorite';
import CloseIcon from '@mui/icons-material/Close';
import DoneIcon from '@mui/icons-material/Done';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import { cancelDateRequest, sendDateRequest, unDateUser, acceptDateRequest } from '../../api/date-api';
import { useDispatch } from 'react-redux';
import { toastError, toastSuccess } from '../../dispatcher/banner';
import  * as bannerActions from "../../action/banner";
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import { saveUser, unsaveUser } from 'api/user-api';
import HeartBrokenOutlinedIcon from '@mui/icons-material/HeartBrokenOutlined';
import { acceptDateRequestFeed, changeDateRequestChangeFeed, unMatchFeed } from 'action/feed';
export function SendDateButton({data}: {data: UserProfile}){
    const [hasSentDate, setHasSentDate] = useState(data.has_current_sent_date_request)
    const [hasUserSentDate, setHasUserSentDate] = useState(data.has_this_user_sent_date_request)
    const [isLoading, setIsLoading] = useState(false)
    const [isDating, setIsDating] = useState(data.is_dating)
    const dispatch = useDispatch()
    const sendDate = async () => {
        setHasSentDate(true);
        dispatch(changeDateRequestChangeFeed(data, true))
        const res = await sendDateRequest(data.uid);
        if(res.success) return;
        toastError(res.msg)
        dispatch(changeDateRequestChangeFeed(data, false))
        setHasSentDate(false)
    }
    const acceptDate = async () => {
        setIsLoading(true)
        dispatch(acceptDateRequestFeed(data))
        const res = await acceptDateRequest(data.uid);
        if(res.success){ 
            setIsDating(true)
            return
        }
        toastError(res.msg)
        setIsLoading(false)
    }
    const cancelDate = async () =>{
        setHasSentDate(false);
        dispatch(changeDateRequestChangeFeed(data, false))
        const res = await cancelDateRequest(data.uid);
        if(res.success){ 
            return
        }
        toastError(res.msg)
        dispatch(changeDateRequestChangeFeed(data, true))
        setHasSentDate(true)
    }
    const unDate = async () => {
        const user_res = window.confirm("Are you sure you want to unmatch this user?")
        if(!user_res) return;
        setIsDating(false);
        setHasSentDate(false);
        setHasUserSentDate(false);
        dispatch(unMatchFeed(data));
        const res = await unDateUser(data.uid);
        if(!res.success){
            toastError(res.msg);
            return setIsDating(true);
        }
    }

    //if they are dating
    if(isDating){
        return(
            <div className = "profile-item-button-container profile-item-button-container-heart">
                <div className = "profile-item-button profile-item-heart-break" onClick = {unDate}>
                    <HeartBrokenOutlinedIcon/>
                </div>
            </div>
        )
    }

    //if viewer has sent date
    if(hasSentDate){
        return(
            <div className = "profile-item-button-container profile-item-button-container-heart">
                <div className = "profile-item-button profile-item-heart" onClick = {cancelDate}>
                    <FavoriteIcon />
                </div>
            </div>
        )
    }

    //if user has sent date
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
                <FavoriteBorderOutlinedIcon />
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
        toastError(res.msg);
        return setHasSaved(false)
    }
    const unSave = async () => {
        setHasSaved(false);
        const res = await unsaveUser(data.uid);
        if(res.success){
            return;
        }
        toastError(res.msg);
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