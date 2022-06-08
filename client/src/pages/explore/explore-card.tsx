import { UserProfile } from "@shared/User";
import { NavLink } from "react-router-dom";

export default function ExploreCard({data}: {data: UserProfile}){
    return(
        <NavLink to = {"/user/"+data.uid} className="explore-card">
            <div className = "explore-card-image-container">
                <img className = "full-img" src = {data.profile_picture_url} />
            </div>
            <div className = "explore-card-main-container">
                <div className = "explore-card-info-container">
                    <div className = "explore-card-username">{data.username}</div>
                    <div className = "explore-card-age">{data.age} years old</div>
                </div>
                <div className = "explore-card-icon-container">

                </div>
            </div>
        </NavLink>
    )
}