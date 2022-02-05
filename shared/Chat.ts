export interface ChatData {
    has_seen: boolean,
    chat_background: string,
    user_data: {
        profile_pic_url: string,
        username: string,
        full_name: string
    }
}

export interface TextMessageData {
    type: "TEXT"|"PHOTO"|"VIDEO",
    id: string,
    text: string,
    sender_uid: string,
    receiver_uid: string,
    is_sent_by_viewer: boolean
}