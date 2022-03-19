import { close } from "../action/banner"
import { toast } from "react-toastify"

function bannerDispatch(dispatch: (action: ActionInterface<any>)=>void, bannerAction: ActionInterface<any>){
    dispatch(bannerAction)
    setTimeout(()=>{
        dispatch(close())
    }, 2000)
}

export function toastError(msg: string){
    toast.error(msg, {
        theme: "dark"
    })
}

export function toastSuccess(msg: string){
    toast.success(msg, {
        theme: "dark",
    })
}

export default bannerDispatch