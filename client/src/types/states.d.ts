import { UserDate } from "@shared/Dates";
import { UserProfile } from "@shared/User";

export interface RootState {
    banner: BannerState,
    current_user: UserProfile|null,
    dates: UserDate[]
}


export interface BannerState {
    error_banner: boolean,
    success_banner: boolean,
    info_banner: boolean,
    message: string
}