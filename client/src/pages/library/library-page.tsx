import { ContainerWithHeader, Header } from "global-components/containers/container-with-header"
import { NavLink } from "react-router-dom"
import NotificationsIcon from '@mui/icons-material/Notifications';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import BookmarksIcon from '@mui/icons-material/Bookmarks';
import "./library-page.css"
function LibraryPage(){
    return (
        <>
            <Header name="Library" />
            <ContainerWithHeader>
                <div className="library-page">
                    <div className = "library-items-container">
                        <LibraryItems name="Notifications" to = "/notifications" Icon={NotificationsIcon} />
                        <LibraryItems name = "Date Requests" to = "/requests/incoming" Icon = {PersonAddAlt1Icon} />
                        <LibraryItems name = "Sent Date Requests" to = "/requests/sent" Icon = {WatchLaterIcon} />
                        <LibraryItems name = "Saved Users" to = "/saved" noBorder Icon = {BookmarksIcon}/>
                    </div>
                </div>
            </ContainerWithHeader>
        </>
    )
}

function LibraryItems({noBorder = false, name, Icon, to}: {noBorder?: boolean, name: string, Icon: any, to: string}){
    return(
        <NavLink to = {to} className="library-item" style={noBorder?{borderBottom: "none" }:{}}>
            <div className = "library-item-icon">
                { <Icon /> }
            </div>
            <div className = "library-item-title">
                { name }
            </div>
            <div className = "library-item-forward">
                <ArrowForwardIosIcon />
            </div>
        </NavLink>
    )
}


export default LibraryPage