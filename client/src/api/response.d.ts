declare interface ApiResponse<T>{
    success: boolean,
    redirect: boolean,
    data: T,
    msg: string,
    redirect_url: string
}