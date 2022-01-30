import { close } from "../action/banner"

function bannerDispatch(dispatch: (action: ActionInterface<string>)=>void, bannerAction: ActionInterface<string>){
    dispatch(bannerAction)
    setTimeout(()=>{
        dispatch(close())
    }, 2000)
}

export default bannerDispatch