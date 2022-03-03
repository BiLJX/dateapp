type BannerActions = "OPEN_BANNER_ERROR"|"OPEN_BANNER_INFO"|"OPEN_BANNER_SUCESS"|"OPEN_BANNER_TEXT_MESSAGE"|"CLOSE_BANNER"
type UserActions = "ADD_CURRENT_USER"
type DateActions = "INIT_DATES"|"ADD_DATE"
type FeedActions = "ADD_FEED"
type ScrollPositionAction = "SAVE_FEED_POSITION"|"SAVE_PICTURES_POSITION"
declare type ActionTypes = BannerActions|UserActions|DateActions|FeedActions|ScrollPositionAction

declare interface ActionInterface<T>{
    type: ActionTypes,
    payload: T
}