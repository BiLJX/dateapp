import { close } from "../action/banner"

function bannerDispatch(dispatch: (action: ActionInterface<any>)=>void, bannerAction: ActionInterface<any>){
    dispatch(bannerAction)
    setTimeout(()=>{
        dispatch(close())
    }, 2000)
}

export default bannerDispatch