import { UserInterface } from "./User";

export interface DateRequest{
    request_sent_by: string,
    request_sent_to: string,
    sender_data: UserInterface
}

export interface DateChat{
    uid: string,
    date_user_uid: string,
    has_read_message: boolean,
    is_fav_chat: boolean,
    latest_message: string
}
