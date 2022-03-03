import { UserProfile } from "@shared/User";
import { FeedState } from "types/states";

export function feedReducer(state: FeedState = {data: [], current_page: 1}, action: ActionInterface<FeedState|number>): FeedState{
    switch(action.type){
        case "ADD_FEED":
            return <FeedState>action.payload;
        default:
            return state
    }
}