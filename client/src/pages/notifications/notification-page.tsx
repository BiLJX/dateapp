import { getNotifications } from "api/notification-api";
import { FC, useEffect } from "react";

const NotificationPage: FC = () => {
    useEffect(()=>{
        getNotifications().then(data=>console.log(data))
    }, [])
    return (
        <div>

        </div>
    )
}

export default NotificationPage;