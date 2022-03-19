import { FC } from "react"
import { UserProfile } from "@shared/User"
import moment from "moment"
import { useEffect, useState } from "react"
import { getPersonalityByType, personality_data } from "api/personality-api"
export default function UserProfileAbout({user}: {user: UserProfile}){
    const personality = getPersonalityByType(user.personality_type)
    return(
        <div className="user-profile-about">
           <InfoContainer>
                <InfoH1>Birth Date</InfoH1>
                <Text>born on {moment(user.birthday).format("MMM Do YYYY")}</Text>
           </InfoContainer>
          
            <InfoContainer>
                <InfoH1>About Me</InfoH1>
                <Text>{user.description}</Text>
            </InfoContainer>

            <InfoContainer>
                <InfoH1>Gender</InfoH1>
                <Text>{user.gender}</Text>
            </InfoContainer>
            
            <InfoContainer>
                <InfoH1>Personality ({personality?.name})</InfoH1>
                <Text>{personality?.description}</Text>
            </InfoContainer>
        </div>
    )
}

const InfoContainer: FC = (props)=> {
    return (
        <div className = "user-profile-info-container">
            {props.children}
        </div>
    )
}

const Text: FC = (props) =>  <span className = "user-profile-about-text">{props.children}</span>

const InfoH1: FC = (props) => <h1 className = "user-profile-about-headings">{props.children}</h1>