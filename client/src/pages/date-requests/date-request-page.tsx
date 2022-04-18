import { UserProfile } from "@shared/User";
import { acceptDateRequest, getIncomingRequests, rejectDateRequest } from "api/date-api";
import { ContainerWithHeader, Header } from "global-components/containers/container-with-header";
import { Fragment, useEffect, useState } from "react";
import { SpinLoader } from "../../global-components/loaders/loaders"
import CloseIcon from '@mui/icons-material/Close';
import DoneIcon from '@mui/icons-material/Done';
import "./date-request.css";
import { useDispatch } from "react-redux";
import * as bannerActions from "../../action/banner";
import bannerDispatch from "dispatcher/banner";
import { NavLink } from "react-router-dom";
import { useBadges } from "hooks/useDateRequest";

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
            <ContainerWithHeader>
                <div className="date-request-page">
                    {
                        requests.map((data, i)=>(
                            <Fragment key = {i}>
                                <DateRequestItem data = {data}/>
                            </Fragment>
                        ))
                    }
                </div>
            </ContainerWithHeader>
        </>
      
    )
}



function DateRequestItem({data}: {data: UserProfile}){
    const [renderNull, setRenderNull] = useState(false)
    const [isLoadingAccept, setIsLoadingAccept] = useState(false);
    const [isLoadingReject, setIsLoadingReject] = useState(false);
    const badges = useBadges()
    const dispatch = useDispatch()
    const acceptRequest = async () => {
        setIsLoadingAccept(true);
        const res = await acceptDateRequest(data.uid);
        if(res.success){
            bannerDispatch(dispatch, bannerActions.success("Accepted"))
            setRenderNull(true)
            setIsLoadingAccept(false)
            badges.decreaseDateRequest()
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
            badges.decreaseDateRequest()
            return;
        }
        setIsLoadingReject(false)
        bannerDispatch(dispatch, bannerActions.error(res.msg))
    }
    if(renderNull) return <></>
    return(
        <div className="date-request-item">
            <div className="date-request-left">
                <NavLink to = {"/user/"+data.uid} className = "date-request-pfp">
                    <img className="full-img" src = {data.profile_picture_url}/>
                </NavLink>
            </div>
            <div className="date-request-right">
                <div className="date-request-name">{data.first_name}</div>
                <div className="date-request-age">{data.age} years old</div>
                <div className="date-request-description ellipsis-clamp">{data.description}</div>
                <div className="date-request-buttons-container">
                    <div className="date-request-button date-request-reject" onClick={rejectRequest}>
                        {isLoadingReject?<SpinLoader color = "black" size = {20} />:<CloseIcon />}
                    </div>
                    <div className="date-request-button date-request-accept" onClick={acceptRequest}>
                        {isLoadingAccept?<SpinLoader size = {20} />:<DoneIcon />}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DateRequestPage