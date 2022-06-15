import { FC } from "react";
import { ExploreData } from "@shared/Explore";
import ExploreCard from "./explore-card"
const ExploreContainer: FC<{data: ExploreData, type: "users"|"chats"}> = ({data, type}) => {
    return (
        <div className="explore-container">
            <div className = "explore-container-header">
                <h1>{data.label}</h1>
            </div>
            <div className = "explore-cards-container">
                {data.items.map((x, i)=>(
                    <ExploreCard key={i} data = {x} to = {type === "users"?"/user/"+x.uid : "/quick/message/"+x.uid}/>
                ))}
            </div>
        </div>
    )
}


export default ExploreContainer
