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

export function changeDateRequestChangeFeed(user: UserProfile, state: boolean): ActionInterface<FeedState>{
    return {
        type: "CHANGE_DATE_REQUEST_CHANGE_FEED",
        payload: {
            data: {
                ...user,
                has_current_sent_date_request: state
            },
            current_page: 1
        }
    }
}

export function acceptDateRequestFeed(user: UserProfile): ActionInterface<FeedState>{
    return {
        type: "ACCEPT_DATE_REQUEST_FEED",
        payload: {
            data: {
                ...user,
                has_this_user_sent_date_request: false,
                has_current_sent_date_request: false,
                is_dating: true
            },
            current_page: 1
        }
    }
}

export function unMatchFeed(user: UserProfile): ActionInterface<FeedState>{
    return {
        type: "UNMATCH_FEED",
        payload: {
            data: {
                ...user,
                has_this_user_sent_date_request: false,
                has_current_sent_date_request: false,
                is_dating: false
            },
            current_page: 1
        }
    }
}
