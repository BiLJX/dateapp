import { ContainerWithHeader, Header } from "global-components/containers/container-with-header"
import { NavLink } from "react-router-dom"
import NotificationsIcon from '@mui/icons-material/Notifications';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import BookmarksIcon from '@mui/icons-material/Bookmarks';
import PersonIcon from '@mui/icons-material/Person';
import "./library-page.css"
import { Switch } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "types/states";
function LibraryPage(){
    const user = useSelector((state: RootState)=>state.current_user)
    function toggleSnapScroll(val: boolean){
        localStorage.setItem("snapScroll", val+"")
    }
    return (
        <>
            <Header name="Library" />
            <ContainerWithHeader>
                <div className="library-page">
                    <div className = "library-items-container">
                        <LibraryItems name="Your Profile" to = {"/user/"+user?.uid} Icon={PersonIcon} />
                        <LibraryItems name="Notifications" to = "/notifications" Icon={NotificationsIcon} />
                        <LibraryItems name = "Date Requests" to = "/requests/incoming" Icon = {PersonAddAlt1Icon} active_count = {user?.badges.date_requests_count} />
                        <LibraryItems name = "Sent Date Requests" to = "/requests/sent" Icon = {WatchLaterIcon} />
                        <LibraryItems name = "Saved Users" to = "/saved" noBorder Icon = {BookmarksIcon}/>
                        <LibrarySwitch disabled name = "Enable Dark Mode" noBorder Icon = {WatchLaterIcon} />
                    </div>
                    </div>
                    <div className = "library-items-container">
                        
                </div>
            </ContainerWithHeader>
        </>
    )
}

interface LibrarySwitchInterface {
    name: string, 
    Icon: any, 
    noBorder?:boolean, 
    disabled?: boolean,
    onChange?: (val: boolean)=>void,
    checked?: boolean
}

function LibrarySwitch({disabled = false, noBorder = false, name, Icon, onChange, checked = false}: LibrarySwitchInterface){
    return(
        <div className="library-item" style={noBorder?{borderBottom: "none" }:{}}>
            <div className = "library-item-icon">
                { <Icon /> }
            </div>
            <div className = "library-item-title">
                { name }
            </div>
            <div className = "library-item-forward">
                <Switch color="primary" disabled = {disabled} onChange = {(e)=>onChange?.(e.target.checked)} defaultChecked = {checked} />
            </div>
        </div>
    )
}

interface LibraryItemsProps {
    noBorder?: boolean, 
    name: string, 
    Icon: any, 
    to: string, 
    active_count?: number
}

function LibraryItems({noBorder = false, name, Icon, to, active_count}: LibraryItemsProps){
    return(
        <NavLink to = {to} className={active_count? "library-item library-item-active" :"library-item"} style={noBorder?{borderBottom: "none" }:{}}>
            <div className = "library-item-icon">
                { <Icon /> }
            </div>
            <div className = "library-item-title">
                { name }
            </div>
            <div className="library-item-count">{active_count?active_count:null}</div>
            <div className = "library-item-forward">
                <ArrowForwardIosIcon />
            </div>
        </NavLink>
    )
}


export default LibraryPage