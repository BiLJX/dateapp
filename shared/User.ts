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
    interests: string[]
}

export interface UserEditClientData {
    username: string,
    full_name: string,
    description: string,
    birthday: string,
    gender: "male"|"female"|"other"|"hide",
}
