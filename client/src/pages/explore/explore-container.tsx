import { FC } from "react";
import { ExploreData } from "@shared/Explore";
import ExploreCard from "./explore-card"
const ExploreContainer: FC<{data: ExploreData}> = ({data}) => {
    return (
        <div className="explore-container">
            <div className = "explore-container-header">
                <h1>{data.label}</h1>
            </div>
            <div className = "explore-cards-container">
                {data.items.map((x, i)=>(
                    <ExploreCard key={i} data = {x}/>
                ))}
            </div>
        </div>
    )
}

export default ExploreContainer
