import { BannerState } from "../types/states"


const defaultState: BannerState = {
    error_banner: false,
    success_banner: false,
    info_banner: false,
    message: ""
}

export const bannerReducer = (state: BannerState = defaultState, action: ActionInterface<string>): BannerState => {
    switch(action.type){
        case "OPEN_BANNER_ERROR":
            return {
                ...state,
                error_banner: true,
                info_banner: false,
                success_banner: false,
                message: action.payload
            }
        case "OPEN_BANNER_INFO":
            return {
                ...state,
                error_banner: false,
                info_banner: true,
                success_banner: false,
                message: action.payload
            }
        case "OPEN_BANNER_SUCESS":
            return {
                ...state,
                error_banner: false,
                info_banner: false,
                success_banner: true,
                message: action.payload
            }
        case "CLOSE_BANNER": 
            return {
                ...state,
                error_banner: false,
                info_banner: false,
                success_banner: false,
                message: ""
            }
        default:
            return state
    }
}