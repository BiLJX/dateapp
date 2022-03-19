import "./edit-profile.css"
import Crop from "global-components/crop/crop-component";
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import DateRangeOutlinedIcon from '@mui/icons-material/DateRangeOutlined';
import EditIcon from '@mui/icons-material/Edit';
import WcOutlinedIcon from '@mui/icons-material/WcOutlined';
import { useSelector, useDispatch } from "react-redux"
import { FormInput, FormSubmit, FormTextArea, SelectOption } from "../../pages/auth/components/form-components";
import { RootState } from "types/states";
import { useEffect, useState } from "react";
import { updateProfile } from "../../api/user-api";
import bannerDispatcher, { toastError } from "../../dispatcher/banner"
import * as bannerActions from "../../action/banner"
import { addCurrentUser } from "../../action/user";
import { NavLink, useNavigate } from "react-router-dom";
import { ContainerWithHeader, Header } from "../../global-components/containers/container-with-header"
import { getPersonalityByType } from "api/personality-api";
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
    const [showCropper, setShowCropper] = useState(false)
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    function handleImageChange(e: any){
        const img = e.target.files?.[0]
        setPfp_img(img)
        setShowCropper(true)
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
            toastError(res.msg)
            setLoading(false)
            return 
        }
        setLoading(false)
        dispatch(addCurrentUser(res.data))
        navigate("/")
    }
    function uploaded(url: string){
        setPfp(url); 
        dispatch(addCurrentUser({...current_user as any, profile_picture_url: url}))
        setShowCropper(false);
    }
    useEffect(()=>{
        if(username !== current_user?.username || full_name !== current_user?.full_name || birthday !== current_user?.birthday || description !== current_user?.description || gender !== current_user?.gender){
            setDisabled(false)
        }else{
            setDisabled(true)
        }
    }, [username, full_name, birthday, description, gender, pfp])
    return(
        <>
            {showCropper && pfp_img && <Crop type = "PFP" image={pfp_img} on_reject = {()=>setShowCropper(false)} on_complete = {uploaded} />}
            
            { isSetup?<Header name = "Setup Profile"/>:<Header name = "Edit Profile" goBackButton/>}
            <ContainerWithHeader>
                <form id = "edit-profile-page" onSubmit = {handleSubmit}>
                    <div className="edit-profile-pfp-container">
                    <div className="edit-profile-pfp">
                            <img alt = "PFP" className="full-img" src = {pfp}/>
                            <input accept = "image/*" id = "upload-pfp" type = "file" onChange={handleImageChange} hidden/>
                            <label htmlFor="upload-pfp" className="upload-pfp-icon">
                                <EditIcon/>
                            </label>
                    </div>
                    </div>
                    <FormInput onChange={(val)=>setUserName(val)} name = "username" placeholder="Username (Dont include 'space' or special charecters)" Icon={PersonOutlineIcon} value={username}/>
                    <FormInput onChange={(val)=>setFull_name(val)} name = "full_name" placeholder="Fullname" Icon={PersonOutlineIcon} value={full_name}/>
                    {isSetup && <FormInput onChange={(val)=>setBirthDay(val)} name = "birthday" placeholder="Birthday" Icon={DateRangeOutlinedIcon} type="date" value={birthday}/>}
                    <SelectOption onChange={(val)=>setGender(val)} data = {options} select_name="gender" Icon = {WcOutlinedIcon} value={gender}/>
                    <FormTextArea onChange={(val)=>setDescription(val)} name = "description" placeholder="Describe yourself (min-10 max-300)" Icon={PersonOutlineIcon} value = {description}/>
                    <NavLink to = "/personality" className="form-input-container">Change Personality Type ({getPersonalityByType(current_user?.personality_type || 0)?.name})</NavLink>
                    <FormSubmit isLoading={loading} value="SAVE" className="no-margin" disabled = {disabled}/>
                </form>
            </ContainerWithHeader>
            
        </>
    )   
}


export default EditProfile