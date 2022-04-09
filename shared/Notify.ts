
type NotificationTypes = "DATE_REQUEST"|"LIKED_POST"|"DATE_ACCEPTED"
export interface NotificationInterface<T = null>{
    sender: string,
    receiver: string,
    type:NotificationTypes,
    has_read: boolean,
    text: string,
    content: T,
    sender_data: {
        name: string,
        profile_picture_url: string,
        uid: string
    }
}