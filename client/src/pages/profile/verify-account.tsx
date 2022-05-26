import { ContainerWithHeader, Header } from "global-components/containers/container-with-header";
import { FormInput, FormSubmit } from "pages/auth/components/form-components";
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import "./verify-account.css"
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "types/states";
import { useEffect, useState } from "react";
import { changeUserEmail, sendVerification, signOut } from "api/auth-api";
import bannerDispatch, { toastError, toastSuccess } from "dispatcher/banner";
import { error, success } from "action/banner";
import { addCurrentUser } from "action/user";
import { useNavigate } from "react-router-dom";
import { CurrentUserProfile } from "@shared/User";
export default function VerifyAccount(){
    const user = useSelector((state: RootState)=>state.current_user);
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [email, setEmail] = useState(user?.email||"");
    const [disabled, setDisabled] = useState(false);
    const [loading, setIsLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [is_verification_sending, setIs_verification_sending] = useState(false)
    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setIsLoading(true)
        const res = await changeUserEmail(email||"");
        if(res.success){
             toastSuccess(res.msg)
             if(user) dispatch(addCurrentUser({...user, email}))
             return setIsLoading(false)
            }
        toastError(res.msg)
        return setIsLoading(false)
    }
    const resend = async () => {
        setIs_verification_sending(true)
        const res = await sendVerification();
        
        if(res.success){
            setSent(true);
            setIs_verification_sending(false)
            return toastSuccess(res.msg)
        }
        setIs_verification_sending(false)
        setSent(false)
        return toastError(res.msg)
    }
    const signout = async () => {
        await signOut();
        navigate("/login");
        dispatch(addCurrentUser(null as any))
    }
    useEffect(()=>{
        if(user?.is_email_verified){
            if(user.account_setuped)return navigate("/")
            else return navigate("/profile/setup")
        }
    }, [])
    useEffect(()=>{
        setDisabled(email?.toLocaleLowerCase() === user?.email.toLocaleLowerCase())
    }, [email, user])
    return(
        <>
            <Header name = "Verify Account" />
            <ContainerWithHeader className="verify-account">
                {
                    sent?(
                        <div className = "verify-text">
                            Verification has been sent, if you cannot find verification in your mail please check your "spam mails".
                            Once you verify, refresh this page. 
                        </div>
                    ):(
                        <div className = "verify-text">
                            Your'e email is not verified, please verify it by going on your mail and refresh this page. If you cant find the verification mail, please check your spam inbox. or 
                            { is_verification_sending?<span> sending...</span> :<span className = "underline" onClick = {resend}> resend</span>}
                        </div>
                    )
                }

                <form className = "verify-form" onSubmit={handleSubmit}>
                    <FormInput 
                    Icon={MailOutlineIcon} 
                    placeholder = "Email" 
                    name="email" 
                    value = {email} 
                    onChange = {(val)=>setEmail(val)}
                    />
                    <FormSubmit isLoading = {loading} value="Change Email" className="no-margin" disabled = {disabled}/>
                </form>
                <div className="verify-signout">
                    <a className="underline" onClick={signout}>signout</a>
                </div>
            </ContainerWithHeader>
        </>
    )
}
