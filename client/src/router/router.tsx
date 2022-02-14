import { useEffect, useState } from "react"
import { BrowserRouter as Router, Route, Routes, useNavigate, useLocation } from "react-router-dom"
import { getCurrentUser } from "../api/auth-api"
import { useDispatch, useSelector } from "react-redux"
import LoginPage from "../pages/auth/login-page"
import { addCurrentUser } from "../action/user"
import SignUpPage from "../pages/auth/signup-page"
import RoutesWithHeader from "./route-with-header"
import { SplashSceenLoader } from "global-components/loaders/loaders"
import { chatContext } from "context/Realtime"
import Chat from "realtime/Chat"
import { io } from "socket.io-client"
import { RootState } from "types/states"
import bannerDispatch from "dispatcher/banner"
import { openTextBanner } from "action/banner"

const temp: any = null
function AppRouter(){
    const [chat, setChat] = useState<Chat>(temp)
    const currentUser = useSelector((state: RootState)=>state.current_user);
    const location = useLocation()
    const dispatch = useDispatch() 
    useEffect(()=>{
        if(currentUser){
            setChat(new Chat(io()))
        }
    }, [currentUser])
    useEffect(()=>{
        if(chat){
            chat.onMessage(data=>{
                console.log(data)
                bannerDispatch(dispatch, openTextBanner(data))
            })
            return(()=>chat.offMessage())
        }
    }, [chat, location])
    return(
        <chatContext.Provider value = {chat} >
            <AllRoutes />
        </chatContext.Provider>
    )
}


function AllRoutes(){
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const location = useLocation()
    const getUser = async () => {
        try{
            const res = await getCurrentUser()
            if(res.redirect && !location.pathname.includes("/signup")){
                return navigate(res.redirect_url)
            }
            if(!res.data.account_setuped && !location.pathname.includes("/signup")){
                navigate("/profile/setup")
            }
            dispatch(addCurrentUser(res.data))
        }catch(err){

        }finally{
            setLoading(false)
        }
    }
    useEffect(()=>{
        getUser()
    }, [])
    if(loading){
        return <SplashSceenLoader />
    }
    return(
        <>
            <RoutesWithHeader />
            <Routes>
                <Route path = "/login" element = {<LoginPage/>}/>
                <Route path = "/signup" element = { <SignUpPage /> } />
            </Routes>
        </>
    )
}

export default AppRouter