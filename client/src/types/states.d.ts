import { TextMessageData } from "@shared/Chat";
import { UserDate } from "@shared/Dates";
import { CurrentUserProfile, UserProfile } from "@shared/User";

export interface RootState {
    banner: BannerState,
    current_user: CurrentUserProfile|null,
    dates: UserDate[]
}


export interface BannerState {
    error_banner: boolean,
    success_banner: boolean,
    info_banner: boolean,
    text_banner: boolean
    message: string,
    recent_msg_obj?: TextMessageData
}