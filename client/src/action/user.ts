import { CurrentUserProfile } from "@shared/User";

export function addCurrentUser(user: CurrentUserProfile): ActionInterface<CurrentUserProfile>{
    return {
        type: "ADD_CURRENT_USER",
        payload: user
    }
}