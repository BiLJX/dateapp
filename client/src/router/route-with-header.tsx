import { Route, Routes, useNavigate, useLocation } from "react-router-dom"
import EditProfile from "../pages/profile/edit-profile"
import HomePage from "pages/home/home-page"
import LibraryPage from "pages/library/library-page"
import DateRequestPage from "pages/date-requests/date-request-page"
import DatePage from "pages/dates/date-page"
import ChatPage from "pages/chat/chat-page"
import UserProfilePage from "pages/user/user-profile-page"
import MainContainer from "global-components/containers/container-with-header"


function RoutesWithHeader(){
    return(
        <MainContainer>
            <Routes>
                <Route path = "/" element = {<HomePage /> } />
                <Route path = "/dates" element = {<DatePage/>} />
                <Route path = "/message/:uid" element = {<ChatPage />} />
                <Route path = "/library" element = { <LibraryPage />  }/>
                <Route path = "/user/:uid/*" element = {<UserProfilePage />} />
                <Route path = "/requests/incoming" element = { <DateRequestPage /> } />
                <Route path = "/profile/edit" element = {<EditProfile />} />
                <Route path = "/profile/setup" element = {<EditProfile isSetup />} />
            </Routes>
        </MainContainer>
    )
}

export default RoutesWithHeader