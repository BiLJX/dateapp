import { FC, useState } from "react"
import AddIcon from '@mui/icons-material/Add';
import "./interests.css"
import HobbySearch from "./search-hobby";
import { NavLink } from "react-router-dom";
import { UserProfile } from "@shared/User";
import { useSelector } from "react-redux";
import { RootState } from "types/states";

export default function UserInterestsPage({user}: {user: UserProfile}){
    const c_user = useSelector((state: RootState)=>state.current_user);

    return(
        <div className = "user-intersts-page">
            <InterestContainer name = "Hobbies">
                {c_user?.uid === user.uid && <NavLink to = "/hobbies" className = "user-interests-bubble-container" style={{backgroundColor: "var(--blue)"}}><AddIcon /></NavLink>}
                { 
                    user.hobbies.map((x, i)=><Bubble key = {i}>{x}</Bubble>)
                }
            </InterestContainer>
        </div>
    )
}


export const Bubble: FC<{className?: string, onClick?: ()=>void}> = (props) => {
    return(
        <span className = {"user-interests-bubble-container "+props.className} onClick = {()=>props.onClick?.()}>
            {props.children}
        </span>
    )
}

const InterestContainer: FC<{name: string}> = (props)=>{
    return(
        <section className = "user-interests-container">
            <div className = "user-interests-container-header">
                <h1>{props.name}</h1>
            </div>
            <div className="user-interests-item-container">
                {props.children}
            </div>
        </section>
    )
}