import { useEffect, useState } from "react"
import { BrowserRouter as Router, Route, Routes, useNavigate, useLocation, NavLink } from "react-router-dom"
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
import { toast } from "react-toastify"
import { TextMessageData } from "@shared/Chat"

const temp: any = null

const Noti = ({data}:{data: TextMessageData}) =>{ 
        console.log(data)
        return (
            <div style = {{display: "flex", flexDirection: "column"}}>
                <span>{data?.author_data?.username}</span>
                <span>{data?.text}</span>
            </div>
         )
}

function AppRouter(){
    const [chat, setChat] = useState<Chat>(temp)
    const currentUser = useSelector((state: RootState)=>state.current_user);
    const location = useLocation()
    const dispatch = useDispatch() 
    const navigate = useNavigate()
    useEffect(()=>{
        if(currentUser){
            setChat(new Chat(io()))
        }
    }, [currentUser])
    useEffect(()=>{
        if(chat && !location.pathname.includes("message") && !location.pathname.includes("dates")){
            chat.onMessage(data=>{
                toast((
                    <NavLink to = {"/message/"+data.sender_uid} style = {{display: "flex", flexDirection: "column"}}>
                        <span className="banner-username">{data.author_data?.username}</span>
                        <span className="banner-message ellipsis">{data.text}</span>
                    </NavLink>
                 ), {
                    icon: () =>  (
                        <NavLink to = {"/message/"+data.sender_uid} style={{borderRadius: "100%", width: "50px", height: "50px", overflow: "hidden" }}>
                            <img className="full-img" src={data.author_data?.profile_pic_url}/>
                        </NavLink>
                    ),
                    theme: "dark",
                    draggable: true,
                    draggablePercent: 20
                })
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
            if(!res.data.is_email_verified && !location.pathname.includes("/signup")){
                navigate("/profile/verify")
            }
            else if(!res.data.account_setuped && !location.pathname.includes("/signup")){
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