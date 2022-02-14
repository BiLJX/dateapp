import { TextMessageData } from "@shared/Chat"
import { BannerState } from "../types/states"


const defaultState: BannerState = {
    error_banner: false,
    success_banner: false,
    info_banner: false,
    text_banner: false,
    message: "",
}

export const bannerReducer = (state: BannerState = defaultState, action: ActionInterface<string|TextMessageData>): BannerState => {
    const msg = <string>action.payload
    const recent_msg_obj = <TextMessageData>action.payload
    switch(action.type){
       
        case "OPEN_BANNER_ERROR":
            return {
                ...state,
                error_banner: true,
                info_banner: false,
                success_banner: false,
                text_banner: false,
                message: msg
            }
        case "OPEN_BANNER_INFO":
            return {
                ...state,
                error_banner: false,
                info_banner: true,
                success_banner: false,
                text_banner: false,
                message: msg
            }
        case "OPEN_BANNER_SUCESS":
            return {
                ...state,
                error_banner: false,
                info_banner: false,
                success_banner: true,
                text_banner: false,
                message: msg
            }
        case "OPEN_BANNER_TEXT_MESSAGE":
            return {
                ...state,
                error_banner: false,
                info_banner: false,
                success_banner: false,
                text_banner: true,
                message: "",
                recent_msg_obj: recent_msg_obj
            }
        case "CLOSE_BANNER": 
            return {
                ...state,
                error_banner: false,
                info_banner: false,
                success_banner: false,
                text_banner: false,
                message: ""
            }
        default:
            return state
    }
}