const state = {
    "Feed": 0,
    "Pictures": 0,
    "has_more_feed": true
}

export const saveScrollPos = (component: "Feed"|"Pictures", pos: number) => {
    state[component] = pos
}

export const getScrollPos = (component: "Feed"|"Pictures") => {
    return state[component]
}

export const hasMoreFeed = state.has_more_feed;

export const setHasMoreFeed = (has_more: boolean) => state.has_more_feed = has_more;
    
