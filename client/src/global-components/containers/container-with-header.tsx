import { NavLink, useLocation, useNavigate } from "react-router-dom"
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AutoAwesomeMotionIcon from '@mui/icons-material/AutoAwesomeMotion';
import PersonIcon from '@mui/icons-material/Person';
import "./container.css"
import { useSelector } from "react-redux";
import { RootState } from "types/states";


function MainContainer({children}: {children?:JSX.Element}){
    return(
        <>
            <main className="main-container">
                {children}
            </main>
            <BottomNav />
        </>
    )
}

export function ContainerWithHeader({className, children}: {className?: string, children: any}){
       return(
           <div className={className} style = {{ paddingTop: "var(--header-height)" }}>
               {children}
           </div>
       ) 
}

function BottomNav(){
    const urls = ["/", "/search", "/dates", "/pictures", "/profile", "/search/quickchats"]
    const location = useLocation();
    const currentUser = useSelector((state: RootState)=>state.current_user);
    // /search/aaa
    const found = urls.find(x=>x===location.pathname);
    if(!found) return <></>
    return(
        <nav className="bottom-nav">
            <NavLink to = "/" className={(navData)=>"bottom-nav-item " + (navData.isActive?"bottom-nav-item-active":"")}>
                <HomeIcon />
            </NavLink>
            <NavLink to = "/search" className={(navData)=>"bottom-nav-item " + (navData.isActive?"bottom-nav-item-active":"")}>
                <SearchIcon />
            </NavLink>
            <NavLink to = "/dates" className={(navData)=>"bottom-nav-item " + (navData.isActive?"bottom-nav-item-active":"")}>
                <FavoriteIcon />
            </NavLink>
            <NavLink to = "/pictures" className={(navData)=>"bottom-nav-item " + (navData.isActive?"bottom-nav-item-active":"")}>
                
                <AutoAwesomeMotionIcon />
            </NavLink>
            <NavLink to = {"/profile"} className={(navData)=>"bottom-nav-item " + (navData.isActive?"bottom-nav-item-active":"")}>
                {currentUser?.badges?.has_date_requests || currentUser?.badges.has_notifications ? <span className = "alert-icon"></span> : null}
                <PersonIcon />
            </NavLink>
        </nav>
    )
}


export function Header({className, name, goBackButton = false, goBackTo}: {className?: string, name: string, goBackButton?: boolean, goBackTo?: any}){
    const navigate = useNavigate();
    return(
        <header className={`main-header ${className || ""}`}>
            <span>{name}</span>
            {goBackButton && (
                <div className="back-arrow-container" onClick = {()=>navigate(goBackTo||-1)}>
                    <ArrowBackIosIcon/>
                </div>
            )}
        </header>
    )
}

export default MainContainer
