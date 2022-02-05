import { UserProfile } from "@shared/User";
import { acceptDateRequest, getIncomingRequests, rejectDateRequest } from "api/date-api";
import { Header } from "global-components/containers/container-with-header";
import { Fragment, useEffect, useState } from "react";
import { SpinLoader } from "../../global-components/loaders/loaders"
import CloseIcon from '@mui/icons-material/Close';
import DoneIcon from '@mui/icons-material/Done';
import "./date-request.css";
import { useDispatch } from "react-redux";
import * as bannerActions from "../../action/banner";
import bannerDispatch from "dispatcher/banner";

function DateRequestPage(){
    const [requests, setRequests] = useState<UserProfile[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const getRequests = async () => {
        const res = await getIncomingRequests();
        if(res.success) setRequests(res.data)
        setIsLoading(false)
    }
    useEffect(()=>{
        getRequests()
    }, [])
    if(isLoading) return (
        <>
            <Header name = "Date Requests" goBackButton />
            <SpinLoader />
        </>
    )
    if(requests.length === 0){
        return(
            <>
                <Header name = "Date Requests" goBackButton />
                <div className="full error-page">
                    <h1>No Date Requests :(</h1>
                </div>
            </>
        )
    }
    return(
        <>
            <Header name = "Date Requests" goBackButton />
            <div className="date-request-page">
                {
                    requests.map((data, i)=>(
                        <Fragment key = {i}>
                            <DateRequestItem data = {data}/>
                        </Fragment>
                    ))
                }
            </div>
        </>
      
    )
}



function DateRequestItem({data}: {data: UserProfile}){
    const [renderNull, setRenderNull] = useState(false)
    const [isLoadingAccept, setIsLoadingAccept] = useState(false);
    const [isLoadingReject, setIsLoadingReject] = useState(false);
    const dispatch = useDispatch()
    const acceptRequest = async () => {
        setIsLoadingAccept(true);
        const res = await acceptDateRequest(data.uid);
        if(res.success){
            bannerDispatch(dispatch, bannerActions.success("Accepted"))
            setRenderNull(true)
            setIsLoadingAccept(false)
            return;
        }
        setIsLoadingAccept(false)
        bannerDispatch(dispatch, bannerActions.error(res.msg))
    }
    const rejectRequest = async () => {
        setIsLoadingReject(true);
        const res = await rejectDateRequest(data.uid);
        if(res.success){
            bannerDispatch(dispatch, bannerActions.success("Rejected"))
            setRenderNull(true)
            setIsLoadingReject(false)
            return;
        }
        setIsLoadingReject(false)
        bannerDispatch(dispatch, bannerActions.error(res.msg))
    }
    if(renderNull) return <></>
    return(
        <div className="date-request-item">
            <div className="date-request-left">
                <div className = "date-request-pfp">
                    <img className="full-img" src = {data.profile_picture_url}/>
                </div>
            </div>
            <div className="date-request-right">
                <div className="date-request-name">{data.first_name}</div>
                <div className="date-request-age">{data.age} years old</div>
                <div className="date-request-description ellipsis-clamp">{data.description}</div>
                <div className="date-request-buttons-container">
                    <div className="date-request-button date-request-reject" onClick={rejectRequest}>
                        {isLoadingReject?"Wait":<CloseIcon />}
                    </div>
                    <div className="date-request-button date-request-accept" onClick={acceptRequest}>
                        {isLoadingAccept?"Wait":<DoneIcon />}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DateRequestPage