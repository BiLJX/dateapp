
import { combineReducers } from "redux"
import { RootState } from "../types/states"
import { bannerReducer } from "./banner"
import { userReducer } from "./user"


const reducers = combineReducers<RootState>({
    banner: bannerReducer,
    current_user: userReducer,
})

export default reducers

