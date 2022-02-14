import { CurrentUserProfile } from "@shared/User";

export function userReducer(state: CurrentUserProfile|null = null, action: ActionInterface<CurrentUserProfile>): CurrentUserProfile|null{
    switch(action.type){
        case "ADD_CURRENT_USER":
            return action.payload
        default:
            return state
    }
}