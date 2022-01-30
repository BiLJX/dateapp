import { UserProfile } from "@shared/User";

export function userReducer(state: UserProfile|null = null, action: ActionInterface<UserProfile>): UserProfile|null{
    switch(action.type){
        case "ADD_CURRENT_USER":
            return action.payload
        default:
            return state
    }
}