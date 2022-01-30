import { UserProfile } from "@shared/User";

export function addCurrentUser(user: UserProfile): ActionInterface<UserProfile>{
    return {
        type: "ADD_CURRENT_USER",
        payload: user
    }
}