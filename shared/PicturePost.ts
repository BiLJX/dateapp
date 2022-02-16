export interface PicturePostSchema {
    picture_id: string,
    posted_by_uid: string,
    picture_url: string,
    liked_by: string[],
    has_liked: boolean,
    caption: string,
    like_count: number,
    uploader_data: {
        uid: string,
        profile_picture_url: string,
        username: string
    }
}
