export function error(msg: string): ActionInterface<string>{
    return {
        type: "OPEN_BANNER_ERROR",
        payload: msg||""
    }
}

export function info(msg: string): ActionInterface<string> {
    return{
        type: "OPEN_BANNER_INFO",
        payload: msg||""
    }
}

export function success(msg: string): ActionInterface<string> {
    return{
        type: "OPEN_BANNER_SUCESS",
        payload: msg||""
    }
}

export function close(): ActionInterface<string> {
    return {
        type: "CLOSE_BANNER",
        payload: ""
    }
}
