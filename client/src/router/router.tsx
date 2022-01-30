import { useEffect, useState } from "react"
import { BrowserRouter as Router, Route, Routes, useNavigate, useLocation } from "react-router-dom"
import { getCurrentUser } from "../api/auth-api"
import { useDispatch } from "react-redux"
import LoginPage from "../pages/auth/login-page"
import { addCurrentUser } from "../action/user"
import SignUpPage from "../pages/auth/signup-page"
import RoutesWithHeader from "./route-with-header"



function AppRouter(){
    return(
        <Router>
           <AllRoutes />
        </Router>
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
        return <h1>LOADING...</h1>
    }
    return(
        <>
            <Routes>
                <Route path = "/login" element = {<LoginPage/>}/>
                <Route path = "/signup" element = { <SignUpPage /> } />
            </Routes>

           <RoutesWithHeader />
              
        </>
    )
}

export default AppRouter