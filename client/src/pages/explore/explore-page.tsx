import { ExploreData } from "@shared/Explore";
import { getExplore, getQuickChats } from "api/explore-api";
import { ContainerWithHeader, Header } from "global-components/containers/container-with-header";
import { SpinLoader } from "global-components/loaders/loaders";
import { useEffect, useState } from "react";
import PersonIcon from '@mui/icons-material/Person';
import MapsUgcIcon from '@mui/icons-material/MapsUgc';
import ExploreContainer from "./explore-container";
import "./explore.css";
import { NavLink, Route, Routes } from "react-router-dom";

export default function ExplorePage(){
    return(
        <>
            <Header name="Explore" />
            <ContainerWithHeader className="explore-page">
                <Nav />
                <Routes>
                    <Route index = {true} element = {<Explore />} />
                    <Route path = "quickchats" element = {<QuickChats />} />
                </Routes>
               
            </ContainerWithHeader>
        </>
    )
}

const Nav = () => {
    return(
        <nav className = "explore-nav">
            <NavLink end to = "" className={({isActive}) => isActive?"explore-nav-item-active":"explore-nav-item"}>
                <div className = "explore-nav-item-icon">
                    <PersonIcon />
                </div>
                <div className = "explore-nav-item-label">
                    Users
                </div>
            </NavLink>
            <NavLink to = "quickchats" className={({isActive}) => isActive?"explore-nav-item-active":"explore-nav-item"}>
                <div className = "explore-nav-item-icon">
                    <MapsUgcIcon />
                </div>
                <div className = "explore-nav-item-label">
                    Quick Chats
                </div>
            </NavLink>
        </nav>
    )
}

const Explore = () => {
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
            { exploreData &&  exploreData.map((x, i)=>(
                <ExploreContainer key={i} data = {x} type = "users"/>
            )) }
        </>
      
    )
}


const QuickChats = () => {
    const [quickChats, setQuickChats] = useState<ExploreData[]>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("")
    const getData = async () => {
        const res = await getQuickChats();
        if(res.success){
            setQuickChats(res.data)
            return setLoading(false)
        }
        setLoading(false)
        setError(res.msg)
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
    if(error){
        return(
            <>
                <Header name="Explore" />
                <div className="full error-page">
                    <h1>{error}</h1>
                </div>
            </>
        )
    }
    if(quickChats && quickChats.length === 0){
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
            { quickChats &&  quickChats.map((x, i)=>(
                <ExploreContainer key={i} data = {x} type = "chats"/>
            )) }
        </>
      
    )
}