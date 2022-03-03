
import { combineReducers } from "redux"
import { RootState } from "../types/states"
import { bannerReducer } from "./banner"
import { dateReducer } from "./date"
import { feedReducer } from "./feed-reducer"
import { scrollPositionReducer } from "./scroll"
import { userReducer } from "./user"


const reducers = combineReducers<RootState>({
    banner: bannerReducer,
    current_user: userReducer,
    dates: dateReducer,
    feed: feedReducer,
    scrollPosition: scrollPositionReducer
})

export default reducers

