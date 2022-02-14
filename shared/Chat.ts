type MessageType = "TEXT"|"PHOTO"|"VIDEO"

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
    type: MessageType,
    message_id: string,
    text: string,
    sender_uid: string,
    receiver_uid: string,
    is_sent_by_viewer: boolean,
    author_data?: {
        profile_pic_url: string,
        username: string
    }
}

export interface TextMessageSocketData {
    type: MessageType,
    text: string,
    receiver_uid: string,
}
