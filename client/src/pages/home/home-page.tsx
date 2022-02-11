import { UserProfile } from '@shared/User'
import { getUsers } from 'api/user-api'
import { Fragment, useEffect, useRef, useState } from 'react'
import createScrollSnap from 'scroll-snap'
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import "./home-page.css"
import { sendDateRequest } from '../../api/date-api';
import { useDispatch } from 'react-redux';
import bannerDispatch from '../../dispatcher/banner';
import  * as bannerActions from "../../action/banner"
import { SaveButton, SendDateButton } from './buttons';
import { HeartLoader } from 'global-components/loaders/loaders';
import { NavLink } from 'react-router-dom';
function HomePage(){
    const [loading, setLoading] = useState(true)
    const [feed, setFeed] = useState<UserProfile[]>([])
    const container_ref = useRef<any>(null)
    async function fetchFeed(){
        const res = await getUsers()
        if(res.success){
            setFeed(res.data)
        }
        setLoading(false)
    }
    useEffect(()=>{
        fetchFeed()
    }, [])
    useEffect(()=>{
        
        if(loading && !container_ref.current) return;
        // createScrollSnap(container_ref.current, {
        //     snapDestinationY: "100%",
        //     duration: 300,
        //     threshold: 0.1
        // },()=>{})
    }, [container_ref, loading])
    if(loading) return <HeartLoader />
    return(
        <div id="home-page" ref = {container_ref} >
            {
                feed.map((x, i)=>(
                    <Fragment key = {i}>
                        <ProfileItem data = {x} />
                    </Fragment>
                ))
            }
        </div>
    )
}

export function ProfileItem({data}: {data: UserProfile}){
    const [hasSentDate, setHasSentDate] = useState(data.has_current_sent_date_request)
    const dispatch = useDispatch()
    const sendDate = async () => {
        setHasSentDate(true)
        const res = await sendDateRequest(data.uid);
        if(res.success) return bannerDispatch(dispatch, bannerActions.success(res.msg));
        bannerDispatch(dispatch, bannerActions.error(res.msg))
        setHasSentDate(false)
    }
    return(
        <article className="profile-item" style={{backgroundImage: `url('${data.profile_picture_url}')`}}>
            <div className = "profile-item-gradient">
                <div className='profile-item-info-container'>
                    <div className = "profile-item-name-container">
                        <h1 className='profile-item-name ellipsis'>{`${data.first_name} (${data.age})`}</h1>
                    </div>
                    <div className = "profile-item-description-container">
                        <span className='ellipsis-clamp'>{data.description}</span>
                    </div>
                    <div className = "profile-item-buttons">
                        <SaveButton data = {data}/>
                        <SendDateButton data = {data}/>
                        <div className = "profile-item-button-container">
                            <NavLink to = {"/user/"+data.uid} className = "profile-item-button profile-item-profile">
                                <PersonOutlineOutlinedIcon />
                            </NavLink>
                        </div>
                    </div>
                </div>
                
            </div>
        </article>
    )
}



export default HomePage