import "./styles.css"
import { Header, ContainerWithHeader } from "../../../global-components/containers/container-with-header"
import { SettingsContainer, SettingsRange, SettingsSaveButton, SettingsSelect, SettingsSwitch } from "../settings-components/settings-components"
import { useEffect, useState } from "react"
import { getFeedSettings, updateFeedSettings } from "api/settings-api"
import { useNavigate } from "react-router-dom"
import { toastError, toastSuccess } from "dispatcher/banner"

const genderFilterData = [
    {
        value: "male",
        placeholder: "Male"
    },
    {
        value: "female",
        placeholder: "Female"
    },
    {
        value: "any",
        placeholder: "Any"
    },
]

const lookingForData = [
    {
        value: "relationship",
        placeholder: "Relationship"
    },
    {
        value: "friendship",
        placeholder: "Friendship"
    },
    {
        value: "any",
        placeholder: "Any"
    },
]


export default function FeedSettings(){
    const [age, setAge] = useState<number[]>([13, 50]);
    const [gender, setGender] = useState<any>("male");
    const [lookingFor, setLookingFor] = useState<any>("any");
    const [loading, setIsLoading] = useState(true);
    const [showYourDates, setShowYourDates] = useState(true);

    const navigate = useNavigate()

    const getSettings = async () => {
        const res = await getFeedSettings();
        if(res.success){
            const settings = res.data;
            setGender(settings.gender_filter);
            setLookingFor(settings.looking_for);
            setAge([settings.age_range.min,settings.age_range.max]);
            setShowYourDates(settings.show_your_dates)
        }
        setIsLoading(false)
    }
    const save = async () => {
        
        const res = await updateFeedSettings({
            uid: "",
            age_range: {
                min: age[0],
                max: age[1]
            },
            gender_filter: gender,
            looking_for: lookingFor,
            personality_filter: [],
            show_your_dates: showYourDates
        })
        if(res.success){
            toastSuccess("saved settings");
            navigate(-1)
            return
        }
        toastError(res.msg)
        
    }
    useEffect(()=>{
        getSettings()
    }, []);
    if(loading) return (
        <>
            <Header name="Feed Settings" goBackButton/>
        </>
    )
    return(
        <>
            <Header name="Feed Settings" goBackButton/>
            <ContainerWithHeader>
                <SettingsContainer>
                    <SettingsSelect defaultValue={gender} onChange={(data)=>setGender(data)} options={genderFilterData} label="Gender Filter" />
                    <SettingsSelect defaultValue={lookingFor} onChange = {(data)=>setLookingFor(data)} options={lookingForData} label="Looking For" />
                    <SettingsRange
                    max={50}
                    min = {13}
                    initial_min = {age[0]}
                    initial_max = {age[1]}
                    onChange = {(min, max)=>setAge([min, max])}
                    />
                    <SettingsSwitch
                    checked = {showYourDates}
                    onChange = {(state)=>setShowYourDates(state)}
                    />
                    <SettingsSaveButton onClick = {save}/>
                </SettingsContainer>
            </ContainerWithHeader>
        </>
    )
}