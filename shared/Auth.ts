export interface SignupData {
    email: string,
    username: string,
    password: string,
    full_name: string,
    birthday: string,
    gender: "male"|"female"|"hidden"|"other"
}