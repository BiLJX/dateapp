import { useParams } from "react-router-dom"
import { changePersonality, getPersonalityByType, personality_data } from "api/personality-api"
import { Header, ContainerWithHeader } from "global-components/containers/container-with-header"
import { FormSubmit } from "pages/auth/components/form-components";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "types/states";
import { addCurrentUser } from "action/user";
export default function Personality(){
    const params = useParams()
    const type = parseInt(params.type||"1");
    const data = getPersonalityByType(type);
    const user = useSelector((state: RootState)=>state.current_user);
    const dispatch = useDispatch()
    const [isLoading, setIsLoading] = useState(false);
    const [disabled, setDisabled] = useState(user?.personality_type === type)

    if(!data) return(
        <div id = "personality">
            <Header name="No Personality Found" goBackButton />
        </div>
    )
    const change = async (e: any) => {
        e.preventDefault()
        if(!user) return
        setIsLoading(true)
        const res = await changePersonality(data.type)
        dispatch(addCurrentUser({...user, personality_type: data.type}));
        setIsLoading(false);
        setDisabled(true)
    }
    return(
        <div id = "personality">
            <Header name  = {data.name} goBackButton />
            <ContainerWithHeader className="personality-container" >
                <div className = "personality-container-heading">
                    <h1>{data.name}</h1>
                </div>
                <div className = "personality-container-description">
                    {data.description}
                </div>
                <form className = "personality-container-submit" onSubmit={change}>
                    <FormSubmit value = "CHANGE TYPE" isLoading = {isLoading} disabled = {disabled} />
                </form>
            </ContainerWithHeader>
        </div>
    )
}