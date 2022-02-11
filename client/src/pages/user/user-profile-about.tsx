import { UserProfile } from "@shared/User"
import moment from "moment"
import { useEffect, useState } from "react"
export default function UserProfileAbout({user}: {user: UserProfile}){
    return(
        <div className="user-profile-about">
           <div className = "user-profile-info-container">
                <h1 className = "user-profile-about-headings">Birth Date</h1>
                <span className = "user-profile-about-text">born on {moment(user.birthday).format("MMM Do YYYY")}</span>
           </div>
          
            <div className = "user-profile-info-container">
                <h1 className = "user-profile-about-headings">About Me</h1>
                <span className = "user-profile-about-text">{user.description}</span>
            </div>

            <div className = "user-profile-info-container">
                <h1 className = "user-profile-about-headings">Gender</h1>
                <span className = "user-profile-about-text">{user.gender}</span>
            </div>
            
        </div>
    )
}