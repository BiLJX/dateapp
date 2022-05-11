
type NotificationTypes = "DATE_REQUEST"|"LIKED_POST"|"DATE_ACCEPTED"|"UNMATCHED"
export interface NotificationInterface<T = null>{
    notification_id: string
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
    },
    createdAt?: Date
}