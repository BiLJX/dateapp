
import { combineReducers } from "redux"
import { RootState } from "../types/states"
import { bannerReducer } from "./banner"
import { dateReducer } from "./date"
import { userReducer } from "./user"


const reducers = combineReducers<RootState>({
    banner: bannerReducer,
    current_user: userReducer,
    dates: dateReducer
})

export default reducers

