type BannerActions = "OPEN_BANNER_ERROR"|"OPEN_BANNER_INFO"|"OPEN_BANNER_SUCESS"|"OPEN_BANNER_TEXT_MESSAGE"|"CLOSE_BANNER"
type UserActions = "ADD_CURRENT_USER"
type DateActions = "INIT_DATES"|"ADD_DATE"
declare type ActionTypes = BannerActions|UserActions|DateActions

declare interface ActionInterface<T>{
    type: ActionTypes,
    payload: T
}