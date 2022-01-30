import { AuthHeader, AuthPageContainer, FormInput, FormSubmit } from "./components/form-components"
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import HttpsOutlinedIcon from '@mui/icons-material/HttpsOutlined';
import { NavLink } from "react-router-dom"
import "./auth-page.css"
import { loginWithEmailAndPassowrd } from "../../api/auth-api";
import { useDispatch } from "react-redux"
import * as bannerActions from "../../action/banner"
import bannerDispatch from "../../dispatcher/banner";
import { useState } from "react";
import { useNavigate } from "react-router-dom"
import { addCurrentUser } from "../../action/user"
function LoginPage(){
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)
    async function login(e: any){
        setIsLoading(true)
        e.preventDefault()
        const input = e.target;
        const email = input.email.value
        const password = input.password.value
        const res = await loginWithEmailAndPassowrd(email, password)
        if(!res.success) {
            bannerDispatch(dispatch, bannerActions.error(res.msg))
            return setIsLoading(false)
        }
        dispatch(addCurrentUser(res.data))
        if(!res.data.account_setuped){
            return navigate("/profile/setup")
        } 
        navigate("/")
    }
    return(
        <AuthPageContainer>
            <AuthHeader heading="Welcome Back" />
            <form className="auth-form-container" onSubmit={login}>
                <FormInput name = "email" placeholder="Email" Icon={MailOutlineIcon}/>
                <FormInput name = "password" placeholder="Password" Icon={HttpsOutlinedIcon} type="password"/>
                <FormSubmit value = "LOGIN" isLoading = {isLoading}/>
            </form>
            <div className="auth-footer">
               dont have account? <NavLink to = "/signup">signup</NavLink> 
            </div>
        </AuthPageContainer>
    )
}

export default LoginPage