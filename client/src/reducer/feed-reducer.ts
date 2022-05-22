import { UserProfile } from "@shared/User";
import { FeedState } from "types/states";

export function feedReducer(state: FeedState = {data: [], current_page: 1}, action: ActionInterface<FeedState>): FeedState{
    let old_feed: UserProfile[];
    let user: UserProfile;
    let new_feed: UserProfile[];
    switch(action.type){
        case "ADD_FEED":
            return <FeedState>action.payload;
        case "CHANGE_DATE_REQUEST_CHANGE_FEED":
            old_feed = [...state.data as UserProfile[]]
            user = action.payload.data as UserProfile;
            new_feed = old_feed.map(x=>{
                if(x.uid === user.uid){
                    x = user;
                }
                return x;
            })
            return {
                ...state,
                data: new_feed
            }
        case "ACCEPT_DATE_REQUEST_FEED":
            old_feed = [...state.data as UserProfile[]]
            user = action.payload.data as UserProfile;
            new_feed = old_feed.map(x=>{
                if(x.uid === user.uid){
                    x = user;
                }
                return x;
            })
            return {
                ...state,
                data: new_feed
            }
        case "UNMATCH_FEED":
            old_feed = [...state.data as UserProfile[]]
            user = action.payload.data as UserProfile;
            new_feed = old_feed.map(x=>{
                if(x.uid === user.uid){
                    x = user;
                }
                return x;
            })
            return {
                ...state,
                data: new_feed
            }
        default:
            return state
    }
}