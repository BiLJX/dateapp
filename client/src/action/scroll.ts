import { ScrollState } from "types/states";

export function saveFeedPosition(pos: number): ActionInterface<number>{
    return {
        type: "SAVE_FEED_POSITION",
        payload: pos
    }
}