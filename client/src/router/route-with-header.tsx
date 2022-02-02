import { Route, Routes, useNavigate, useLocation } from "react-router-dom"
import ContainerWithHeader from "global-components/containers/container-with-header"
import EditProfile from "../pages/profile/edit-profile"
import HomePage from "pages/home/home-page"
import LibraryPage from "pages/library/library-page"


function RoutesWithHeader(){
    return(
        <ContainerWithHeader>
            <Routes>
                <Route path = "/" element = {<HomePage /> } />
                <Route path = "/library" element = { <LibraryPage />  }/>
                <Route path = "/profile/edit" element = {<EditProfile />} />
                <Route path = "/profile/setup" element = {<EditProfile isSetup />} />
                
            </Routes>
        </ContainerWithHeader>
    )
}

export default RoutesWithHeader