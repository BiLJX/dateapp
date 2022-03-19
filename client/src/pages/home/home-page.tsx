import { UserProfile } from '@shared/User'
import { getUsers } from 'api/user-api'
import { Fragment, useEffect, useRef, useState } from 'react'
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import "./home-page.css"
import { sendDateRequest } from '../../api/date-api';
import { useDispatch, useSelector } from 'react-redux';
import bannerDispatch from '../../dispatcher/banner';
import  * as bannerActions from "../../action/banner"
import { SaveButton, SendDateButton } from './buttons';
import { HeartLoader } from 'global-components/loaders/loaders';
import { NavLink } from 'react-router-dom';
import FeedAd from 'global-components/ads/FeedAd';
import { RootState } from 'types/states';
import { addFeed } from 'action/feed';
import { getScrollPos, saveScrollPos } from 'utils/scrollPos';
function HomePage(){
    const redux = useSelector((state: RootState)=>state.feed);
    const scrollPosition = getScrollPos("Feed")
    const feed = redux.data
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(feed.length === 0)
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(redux.current_page);
    const [isFetching, setIsFetching] = useState(false);
    const container_ref = useRef<HTMLDivElement>(null)

    async function fetchFeed(){
        
        setIsFetching(true)
        const res = await getUsers(page)
        if(res.success){
            dispatch(addFeed([...feed, ...res.data], page+1))
            if(res.data.length < 10) {
                setHasMore(false)
            }
        }
        setIsFetching(false)
        loading && setLoading(false)
        
        
    }
    useEffect(()=>{
        container_ref.current && container_ref.current.scrollTo({ top: scrollPosition })
    }, [container_ref])
    useEffect(()=>{
        hasMore && fetchFeed()
    }, [page])
    const onScroll = (e: any) => {
        const ratio = (e.target.scrollTop / e.target.scrollHeight)*100
        saveScrollPos("Feed", e.target.scrollTop)
        if(ratio > 60 && !isFetching){
            setPage((page)=>page+1)
        }
    }
    if(loading) return <HeartLoader />
    return(
        <div id="home-page" ref = {container_ref} onScroll = {onScroll} >
            {
                feed.map((x, i)=>(
                    <Fragment key= {i}>
                        <ProfileItem data = {x} />
                        {(i+1) % 10 === 0 && <FeedAd />}
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