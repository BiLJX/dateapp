import { useState } from "react"
import { NavLink, useNavigate } from "react-router-dom"
import { AuthHeader, AuthPageContainer, FormInput, FormSubmit, SelectOption, SelectOptionData } from "./components/form-components"
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import HttpsOutlinedIcon from '@mui/icons-material/HttpsOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import DateRangeOutlinedIcon from '@mui/icons-material/DateRangeOutlined';
import WcOutlinedIcon from '@mui/icons-material/WcOutlined';
import "./auth-page.css"
import { SignupData } from "@shared/Auth";
import { signUpWithEmailAndPassword } from "api/auth-api";
import { useDispatch } from "react-redux";
import * as actionBanner from "../../action/banner"
import bannerDispatch from "../../dispatcher/banner";
import { addCurrentUser } from "action/user";
function SignUpPage(){
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const options: SelectOptionData[] = [
        {
            option: "Gender-hidden",
            value: "hidden",
        },
        {
            option: "Male",
            value: "male",
        },
        {
            option: "Female",
            value: "female"
        },
        {
            option: "Other",
            value: "other"
        }
    ]
    const signup = async (e: any) => {
        e.preventDefault();
        setIsLoading(true)
        const form = e.target
        const data: SignupData = {
            email: form.email.value,
            username: form.username.value,
            full_name: form.full_name.value,
            birthday: form.birthday.value,
            password: form.password.value,
            gender: form.gender.value
        }
        const res = await signUpWithEmailAndPassword(data)
        if(!res.success){
            bannerDispatch(dispatch, actionBanner.error(res.msg)) 
            setIsLoading(false)
            return 
        }
        dispatch(addCurrentUser(res.data));
        setIsLoading(false)
        navigate("/profile/verify")
    }
    return(
        <AuthPageContainer>
            <AuthHeader heading="Create a new account" />
            <form className="auth-form-container signup-form-container" onSubmit={signup}>
                <FormInput name = "email" placeholder="Email" Icon={MailOutlineIcon}/>
                <FormInput name = "username" placeholder="Username (Dont include 'space' or special charecters)" Icon={PersonOutlineIcon}/>
                <FormInput name = "full_name" placeholder="Fullname" Icon={PersonOutlineIcon}/>
                <FormInput name = "birthday" placeholder="Birthday" Icon={DateRangeOutlinedIcon} type="date"/>
                <FormInput name = "password" placeholder="Password" Icon={HttpsOutlinedIcon} type="password"/>
                <SelectOption data = {options} select_name="gender" Icon={WcOutlinedIcon}/>
                
                <FormSubmit value = "SIGNUP" isLoading = {isLoading} className="no-margin"/>
                
            </form>
            <div className="auth-footer">
               already have account? <NavLink style={{ marginLeft: "0.5rem", textDecoration: "underline" }} to = "/login">login</NavLink> 
            </div>
        </AuthPageContainer>
    )
}

export default SignUpPage