type BannerActions = "OPEN_BANNER_ERROR"|"OPEN_BANNER_INFO"|"OPEN_BANNER_SUCESS"|"CLOSE_BANNER"
type UserActions = "ADD_CURRENT_USER"
declare type ActionTypes = BannerActions|UserActions

declare interface ActionInterface<T>{
    type: ActionTypes,
    payload: T
}