import { addCurrentUser } from "action/user";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "types/states";

export function useBadges(){
    const user = useSelector((state: RootState)=>state.current_user);
    const dispatch = useDispatch();
    class Badge {
        public static increaseDateRequest(){
            if(!user) return;
            const badges = {...user.badges}
            badges.date_requests_count += 1;
            badges.has_date_requests = badges.date_requests_count !== 0;
            dispatch(addCurrentUser({...user, badges}));
        }
        public static decreaseDateRequest(){
            if(!user) return;
            const badges = {...user.badges}
            badges.date_requests_count -= 1;
            badges.has_date_requests = badges.date_requests_count !== 0;
            dispatch(addCurrentUser({...user, badges}));
        }
        public static readNotifications(){
            if(!user) return;
            const badges = {...user.badges}
            badges.notifications_count = 0;
            badges.has_notifications = false;
            dispatch(addCurrentUser({...user, badges}));
        }
    }
    return Badge;
}