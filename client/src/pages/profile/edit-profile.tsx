import "./edit-profile.css"
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import DateRangeOutlinedIcon from '@mui/icons-material/DateRangeOutlined';
import EditIcon from '@mui/icons-material/Edit';
import WcOutlinedIcon from '@mui/icons-material/WcOutlined';
import { useSelector, useDispatch } from "react-redux"
import { FormInput, FormSubmit, FormTextArea, SelectOption } from "../../pages/auth/components/form-components";
import { RootState } from "types/states";
import { useEffect, useState } from "react";
import { updateProfile } from "../../api/user-api";
import bannerDispatcher from "../../dispatcher/banner"
import * as bannerActions from "../../action/banner"
import { addCurrentUser } from "../../action/user";
import { useNavigate } from "react-router-dom";
import { Header } from "../../global-components/containers/container-with-header"
const options = [
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

function EditProfile({isSetup = false}: {isSetup?: boolean}){
    const [disabled, setDisabled] = useState(true)
    const current_user = useSelector((state: RootState)=>state.current_user)
    const [username, setUserName] = useState<any>(current_user?.username)
    const [full_name, setFull_name] = useState<any>(current_user?.full_name)
    const [birthday, setBirthDay] = useState<any>(current_user?.birthday)
    const [description, setDescription] = useState<any>(current_user?.description)
    const [ gender, setGender ] = useState<any>(current_user?.gender)
    const [pfp, setPfp] = useState(current_user?.profile_picture_url)
    const [pfp_img, setPfp_img] = useState<File>()
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    function handleImageChange(e: any){
        const img = e.target.files?.[0]
        const url = URL.createObjectURL(img)
        setPfp(url)
        setPfp_img(img)
    }
    async function handleSubmit(e: any){
        e.preventDefault()
        setLoading(true)
        const res = await updateProfile({
            username,
            full_name,
            birthday,
            description,
            gender
        }, pfp_img)
        if(!res.success) {
            bannerDispatcher(dispatch, bannerActions.error(res.msg))
            setLoading(false)
            return 
        }
        setLoading(false)
        dispatch(addCurrentUser(res.data))
        navigate("/")
    }
    useEffect(()=>{
        if(username !== current_user?.username || full_name !== current_user?.full_name || birthday !== current_user?.birthday || description !== current_user?.description || gender !== current_user?.gender || pfp !== current_user?.profile_picture_url){
            setDisabled(false)
        }else{
            setDisabled(true)
        }
    }, [username, full_name, birthday, description, gender, pfp])
    return(
        <>
            { isSetup?<Header name = "Setup Profile"/>:<Header name = "Edit Profile" goBackButton/>}
            <form id = "edit-profile-page" onSubmit = {handleSubmit}>
                <div className="edit-profile-pfp-container">
                <div className="edit-profile-pfp">
                        <img alt = "PFP" className="full-img" src = {pfp}/>
                        <input id = "upload-pfp" type = "file" onChange={handleImageChange} hidden/>
                        <label htmlFor="upload-pfp" className="upload-pfp-icon">
                            <EditIcon/>
                        </label>
                </div>
                </div>
                <FormInput onChange={(val)=>setUserName(val)} name = "username" placeholder="Username (Dont include 'space' or special charecters)" Icon={PersonOutlineIcon} value={username}/>
                <FormInput onChange={(val)=>setFull_name(val)} name = "full_name" placeholder="Fullname" Icon={PersonOutlineIcon} value={full_name}/>
                <FormInput onChange={(val)=>setBirthDay(val)} name = "birthday" placeholder="Birthday" Icon={DateRangeOutlinedIcon} type="date" value={birthday}/>
                <SelectOption onChange={(val)=>setGender(val)} data = {options} select_name="gender" Icon = {WcOutlinedIcon} value={gender}/>
                <FormTextArea onChange={(val)=>setDescription(val)} name = "description" placeholder="Describe yourself (min-10 max-100)" Icon={PersonOutlineIcon} value = {description}/>
                <FormSubmit isLoading={loading} value="SAVE" className="no-margin" disabled = {disabled}/>
            </form>
        </>
    )   
}


export default EditProfile