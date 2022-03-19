import { ContainerWithHeader, Header } from "global-components/containers/container-with-header";
import { PersonalityInterface, personality_data } from "../../../api/personality-api";
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { FC } from "react";
import "./personality.css"
import { NavLink } from "react-router-dom";
export default function PersonalitiesPage(){
    return(
        <div id="personalities">
            <Header name = "Personalities" goBackButton/>
            <ContainerWithHeader>
                <div className = "personality-items-container">
                    { personality_data.map((x, i)=><Item key = {i} data = {x} />) }
                </div>
            </ContainerWithHeader>
        </div>
    )
}

const Item: FC<{data: PersonalityInterface}> = (props)=> {
    if(props.data.type === 0) return <></>
    return(
        <NavLink to = {props.data.type+""} className="personality-item">
            <div className = "personality-item-left">
                <div className = "personality-item-title">{props.data.name}</div>
                <div className = "personality-item-description ellipsis">{props.data.description}</div>
            </div>
            <div className = "personality-item-right">
                <ChevronRightIcon />
            </div>
        </NavLink>
    )
}