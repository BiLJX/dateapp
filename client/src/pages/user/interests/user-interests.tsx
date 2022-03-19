import { FC, useEffect, useState } from "react"
import AddIcon from '@mui/icons-material/Add';
import "./interests.css"
import HobbySearch from "./search-hobby";
import { NavLink } from "react-router-dom";
import { UserProfile } from "@shared/User";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "types/states";
import CloseIcon from '@mui/icons-material/Close';
import { removeHobby } from "api/hobby-api";
import { addCurrentUser } from "action/user";

export default function UserInterestsPage({user}: {user: UserProfile}){
    const c_user = useSelector((state: RootState)=>state.current_user);
    const [hobbies, setHobbies] = useState(user.hobbies);
    const dispatch = useDispatch()
    const remove = async (hobby: string) => {
        if(!c_user) return;
        const user_res = window.confirm("Do you want to remove this hobby?");
        if(!user_res) return;
        let hobbies = [...c_user.hobbies];
        hobbies = hobbies.filter(x=>x !== hobby);
        dispatch(addCurrentUser({...c_user, hobbies}))
        setHobbies(hobbies)
        await removeHobby(hobby);
    }
    return(
        <div className = "user-intersts-page">
            <InterestContainer name = "Hobbies">
                {c_user?.uid === user.uid && <NavLink to = "/hobbies" className = "user-interests-bubble-container" style={{backgroundColor: "var(--blue)"}}><AddIcon /></NavLink>}
                { 
                    hobbies.map((x, i)=>(
                        <Bubble key = {i}>
                            {x}
                            { 
                                c_user?.uid === user.uid && (
                                    <div className = "user-interests-bubble-container-cross" onClick={()=>remove(x)}>
                                        <CloseIcon/>
                                    </div>
                                )
                            }
                        </Bubble>
                    ))
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