export interface UserInterface {
    uid: string,
    email: string,
    username: string,
    full_name: string,
    first_name: string,
    last_name: string,
    description: string,
    gender: "male"|"female"|"other"|"hide",
    birthday: string,
    profile_picture_url: string,
    cover_picture_url: string,
    dates: string[],
    is_admin: boolean,
    interests: string[],
    saved_users: string[],
    account_setuped: boolean,
    is_email_verified: boolean
}


export interface UserProfile extends UserInterface{
    age: number,
    has_current_sent_date_request: boolean,
    is_dating: boolean,
    has_this_user_sent_date_request: boolean,
    has_saved: boolean
}

export interface CurrentUserProfile extends UserProfile {
    library: {
        has_date_requests: boolean,
        has_notifications: boolean,
        notifications_count: number,
        date_requests_count: number
    }
}

export interface UserEditClientData {
    username: string,
    full_name: string,
    description: string,
    birthday: string,
    gender: "male"|"female"|"other"|"hide",
}
