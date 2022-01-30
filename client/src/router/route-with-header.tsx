import { Route, Routes, useNavigate, useLocation } from "react-router-dom"
import ContainerWithHeader from "global-components/containers/container-with-header"
import EditProfile from "../pages/profile/edit-profile"


function RoutesWithHeader(){
    return(
        <ContainerWithHeader>
            <Routes>
                <Route path = "/profile/edit" element = {<EditProfile />} />
                <Route path = "/profile/setup" element = {<EditProfile />} />
            </Routes>
        </ContainerWithHeader>
    )
}

export default RoutesWithHeader