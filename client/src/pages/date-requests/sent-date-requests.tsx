import { UserProfile } from "@shared/User";
import { acceptDateRequest, getIncomingRequests, getSentRequests, rejectDateRequest } from "api/date-api";
import { ContainerWithHeader, Header } from "global-components/containers/container-with-header";
import { Fragment, useEffect, useState } from "react";
import { SpinLoader } from "../../global-components/loaders/loaders"
import CloseIcon from '@mui/icons-material/Close';
import DoneIcon from '@mui/icons-material/Done';
import "./date-request.css";
import { useDispatch } from "react-redux";
import { toastError, toastSuccess } from "dispatcher/banner";
import { NavLink } from "react-router-dom";
import { useBadges } from "hooks/useDateRequest";

function SentRequestsPage(){
    const [requests, setRequests] = useState<UserProfile[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const getRequests = async () => {
        const res = await getSentRequests();
        if(res.success) setRequests(res.data)
        setIsLoading(false)
    }
    useEffect(()=>{
        getRequests()
    }, [])
    if(isLoading) return (
        <>
            <Header name = "Sent Requests" goBackButton />
            <SpinLoader />
        </>
    )
    if(requests.length === 0){
        return(
            <>
                <Header name = "Sent Requests" goBackButton />
                <div className="full error-page">
                    <h1>No Sent Requests :(</h1>
                </div>
            </>
        )
    }
    return(
        <>
            <Header name = "Sent Requests" goBackButton />
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
    if(renderNull) return <></>
    return(
        <NavLink to = {"/user/"+data.uid}  className="date-request-item-sent">
            <div className="date-request-left">
                <div className = "date-request-pfp">
                    <img className="full-img" src = {data.profile_picture_url}/>
                </div>
            </div>
            <div className="date-request-middle">
                <div className="date-request-name">{data.first_name}</div>
                <div className="date-request-age">{data.age} years old</div>
            </div>
        </NavLink>
    )
}

export default SentRequestsPage