import { UserProfile } from "@shared/User";
import { ContainerWithHeader, Header } from "global-components/containers/container-with-header";
import { Fragment, useEffect, useState } from "react";
import { SpinLoader } from "../../global-components/loaders/loaders"
import { NavLink } from "react-router-dom";
import { getSavedUser } from "api/user-api";

function SavedUsers(){
    const [requests, setRequests] = useState<UserProfile[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const getRequests = async () => {
        const res = await getSavedUser();
        if(res.success) setRequests(res.data.reverse())
        setIsLoading(false)
    }
    useEffect(()=>{
        getRequests()
    }, [])
    if(isLoading) return (
        <>
            <Header name = "Saved" goBackButton />
            <SpinLoader />
        </>
    )
    if(requests.length === 0){
        return(
            <>
                <Header name = "Saved" goBackButton />
                <div className="full error-page">
                    <h1>You haven't saved any users</h1>
                </div>
            </>
        )
    }
    return(
        <>
            <Header name = "Saved" goBackButton />
            <ContainerWithHeader>
                <div className="date-request-page">
                    {
                        requests.map((data, i)=>(
                            <Fragment key = {i}>
                                <SavedItem data = {data}/>
                            </Fragment>
                        ))
                    }
                </div>
            </ContainerWithHeader>
        </>
      
    )
}



function SavedItem({data}: {data: UserProfile}){
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

export default SavedUsers