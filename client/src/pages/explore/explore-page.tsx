import { ExploreData } from "@shared/Explore";
import { getExplore } from "api/explore-api";
import { ContainerWithHeader, Header } from "global-components/containers/container-with-header";
import { SpinLoader } from "global-components/loaders/loaders";
import { useEffect, useState } from "react";
import ExploreCard from "./explore-card"
import ExploreContainer from "./explore-container";
import "./explore.css";
export default function ExplorePage(){
    const [exploreData, setExploreData] = useState<ExploreData[]>();
    const [loading, setLoading] = useState(true)
    const getData = async () => {
        const res = await getExplore();
        if(res.success){
            setExploreData(res.data)
        }
        setLoading(false)
    }
    useEffect(()=>{
        getData()
    }, [])

    if(loading){
        return (
            <>
                <Header name="Explore" />
                <SpinLoader />
            </>
        )
    }
    
    if(exploreData && exploreData.length === 0){
        return(
            <>
                <Header name="Explore" />
                <div className="full error-page">
                    <h1>No one matched your interests. Try Changing your interests</h1>
                </div>
            </>
        )
    }
    return(
        <>
            <Header name="Explore" />
            <ContainerWithHeader className="explore-page">
                { exploreData &&  exploreData.map((x, i)=>(
                    <ExploreContainer key={i} data = {x} />
                )) }
            </ContainerWithHeader>
        </>
    )
}