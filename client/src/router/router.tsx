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
import { NotificationInterface } from "@shared/Notify"
import { toast } from "react-toastify"
import { TextMessageData } from "@shared/Chat"
import { BannerContent, BannerPfpIcon } from "global-components/banners/banner"
import { useBadges } from "hooks/useDateRequest"

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
    const badges = useBadges()
    useEffect(()=>{
        if(currentUser){
            const socket = io();
            setChat(new Chat(socket));
            console.log("connected")
            socket.on("notification", (data: NotificationInterface)=>{
                switch(data.type){
                    case "DATE_REQUEST":
                        toast((<BannerContent sender_name={data.sender_data.name} text = {data.text} to = "/requests/incoming" type={2} />), {
                            icon: () =>(<BannerPfpIcon  to = {"/requests/incoming"} pfp = {data.sender_data?.profile_picture_url} />),
                            theme: "dark",
                            draggable: true,
                            draggablePercent: 20
                        })
                        badges.increaseDateRequest();
                        break;
                    case "DATE_ACCEPTED":
                        toast((<BannerContent sender_name={data.sender_data.name} text = {data.text} to = "/notifications" type={2} />), {
                            icon: () =>(<BannerPfpIcon  to = {"/notifications"} pfp = {data.sender_data?.profile_picture_url} />),
                            theme: "dark",
                            draggable: true,
                            draggablePercent: 20
                        })
                        badges.increaseNotifications()
                        break;
                    case "UNMATCHED":
                        toast((<BannerContent sender_name={data.sender_data.name} text = {data.text} to = "/notifications" type={2} />), {
                            icon: () =>(<BannerPfpIcon  to = {"/notifications"} pfp = {data.sender_data?.profile_picture_url} />),
                            theme: "dark",
                            draggable: true,
                            draggablePercent: 20
                        })
                        badges.increaseNotifications()
                        break;
                    case "LIKED_POST":
                        toast((<BannerContent sender_name={data.sender_data.name} text = {data.text} to = "/notifications" type={2} />), {
                            icon: () =>(<BannerPfpIcon  to = {"/notifications"} pfp = {data.sender_data?.profile_picture_url} />),
                            theme: "dark",
                            draggable: true,
                            draggablePercent: 20
                        })
                        badges.increaseNotifications()
                        break;
                    
                }
               
            })
        }
    }, [currentUser?.uid])
    useEffect(()=>{
        if(chat && !location.pathname.includes("message") && !location.pathname.includes("dates")){
            chat.onMessage(data=>{
                toast(<BannerContent sender_name={data.author_data?.username||""} text = {data.text} to = {"/message/"+data.sender_uid} type={1} />, {
                    icon: () => <BannerPfpIcon  to = {"/message/"+data.sender_uid} pfp = {data.author_data?.profile_pic_url||""} />,
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