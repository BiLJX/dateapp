import { UserProfile } from "@shared/User";
import { FeedState } from "types/states";

export function addFeed(feed: UserProfile[], page: number): ActionInterface<FeedState> {
    return {
        type: "ADD_FEED",
        payload: {
            data: feed,
            current_page: page,
        }
    }
}

