import { UserInterface } from "./User";

export interface DateRequest{
    request_sent_by: string,
    request_sent_to: string,
    sender_data: UserInterface
}

export interface UserDate{
    uid: string,
    date_user_uid: string,
    has_read_message: boolean,
    is_fav_chat: boolean,
    latest_message: string,
    date_user_data: {
        uid: string,
        full_name: string,
        profile_picture_url: string,
        username: string
    }
}
