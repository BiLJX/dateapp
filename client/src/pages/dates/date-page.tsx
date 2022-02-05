import { UserDate } from "@shared/Dates";
import { initDates } from "action/date";
import { getUserDates } from "api/date-api";
import { Header } from "global-components/containers/container-with-header";
import { HeartLoader } from "global-components/loaders/loaders";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { RootState } from "types/states";
import "./date-page.css"

export default function DatePage(){
    const dates = useSelector((state: RootState)=>state.dates)
    const dispatch = useDispatch()
    const [isLoading, setIsLoading] = useState(dates.length === 0)
    const getData = async () => {
        const res = await getUserDates();
        if(res.success) dispatch(initDates(res.data)) ;
        setIsLoading(false)
    }
    useEffect(()=>{
        getData()
    }, [])

    if(isLoading) return ( 
        <>
            <Header name = "Your Dates" />
            <HeartLoader />
        </>
    ) 
    if(dates.length === 0){
        return(
            <>
                <Header name = "Your Dates" />
                <div className="full error-page">
                    <h1>You dont have any dates :(</h1>
                </div>
            </>
        )
    }

    return(
        <>
            <Header name = "Your Dates" />
            <div className = "date-page">
                {dates.map((x, i)=>(
                    <Fragment key = {i}>
                        <DateItem data= {x} />
                    </Fragment>
                ))}
            </div>
        </>
      
    )
}

function DateItem({data}: {data: UserDate}){
    return(
        <NavLink className="date-page-item" to = {"/message/"+data.date_user_data.uid}>
            <div className = "date-page-item-left">
                <div className = "date-page-item-pfp">
                    <img className = "full-img" src = {data.date_user_data.profile_picture_url} />
                </div>
            </div>
            <div className="date-page-item-right">
                <div className = "date-page-item-name ellipsis">
                    {data.date_user_data.full_name}
                </div>
                <div className = "date-page-item-message ellipsis">
                    { data.latest_message }
                </div>
            </div>
        </NavLink>
    )
}