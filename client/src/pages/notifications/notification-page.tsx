import { NotificationInterface } from "@shared/Notify";
import { getNotifications } from "api/notification-api";
import { SpinLoader } from "global-components/loaders/loaders";
import { useBadges } from "hooks/useDateRequest";
import moment from "moment";
import { FC, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { ContainerWithHeader, Header } from "../../global-components/containers/container-with-header"
import "./notifications.css";


const NotificationPage: FC = () => {
    const badges = useBadges()
    const [notifications, setNotifications] = useState<NotificationInterface<any>[]>();
    useEffect(()=>{
        moment.locale('en', {
            relativeTime : {
                future: "in %s",
                past:   "%s",
                s:  "s",
                m:  "1m",
                mm: "%dm",
                h:  "1h",
                hh: "%dh",
                d:  "1d",
                dd: "%dd",
                M:  "1mth",
                MM: "%dmth",
                y:  "1y",
                yy: "%dy"
            }
        });
        getNotifications().then(data=>setNotifications(data.data.reverse()));
        badges.readNotifications()
    }, [])
    if(notifications === undefined) {
        return(
            <>
                <Header goBackButton name="Notifications" />
                <ContainerWithHeader className="notifications-container">
                    <SpinLoader />
                </ContainerWithHeader>
            </>
        )
       
    }
    if(notifications?.length === 0) {
        return(
            <>
                <Header goBackButton name="Notifications" />
                <div className="full error-page">
                    <h1>You dont have any notifications</h1>
                </div>
            </>
        )
    }
    return (
        <>
            <Header goBackButton name="Notifications" />
            <ContainerWithHeader className="notifications-container">
                {
                    notifications.map((data, i)=><NotificationComponent key = {i} data = {data} />)
                }
            </ContainerWithHeader>
        </>
    )
}

const NotificationComponent: FC<{data: NotificationInterface}> = ({data}) => {
    return(
        <div className="notification-component">
            <div className = "notification-left">
                <div className = "notification-pfp">
                    <img className="full-img" src = {data.sender_data.profile_picture_url} />
                </div>
            </div>
            <div className = "notification-middle">
                <span className="notification-text">
                    <NavLink to = {"/user/"+data.sender_data.uid} className="notification-username">{`${data.sender_data.name} `}</NavLink> {`${data.text}. `}
                    <span className="notification-time">{moment(data.createdAt).fromNow()}</span>
                </span>
                
            </div>
            <div className = "notification-right">
                {   data.type === "DATE_ACCEPTED"?(
                            <NavLink to = {"/message/"+data.sender_data.uid} className = "notification-button">
                                Chat Now
                            </NavLink>
                        ):null
                }
            </div>
        </div>
    )
}

export default NotificationPage;