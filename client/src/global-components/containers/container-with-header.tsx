import { useLocation, useNavigate } from "react-router-dom"
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import "./container.css"

const headerMapping = [
    {
        url: "/profile/edit",
        header_title: "Edit Profile",
        go_back_buton: true
    },
    {
        url: "/profile/setup",
        header_title: "Setup your Profile",
        go_back_buton: false
    }
]

function ContainerWithHeader({children}: {children?:JSX.Element}){
    const navigate = useNavigate()
    const location = useLocation();
    const found = headerMapping.find(map=>location.pathname.includes(map.url))
    const title = found?.header_title
    const go_back_buton = found?.go_back_buton
    if(!title) return <>{children}</>
    return(
        <div className = "container-with-header">
            <header className="main-header">
                <span>{title||"Date App"}</span>
                {go_back_buton && (
                    <div className="back-arrow-container" onClick = {()=>navigate(-1)}>
                        <ArrowBackIosIcon/>
                    </div>
                )}
            </header>
            <main className="main-container">
                {children}
            </main>
        </div>
    )
}

export default ContainerWithHeader
