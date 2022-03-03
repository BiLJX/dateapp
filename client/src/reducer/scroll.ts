import { ScrollState } from "types/states";

export function scrollPositionReducer(state: ScrollState = {feed: 0, pictures: 0}, action: ActionInterface<number>): ScrollState{
    switch(action.type){
        case "SAVE_FEED_POSITION":
            return {...state, feed: action.payload};
        default:
            return state
    }
}