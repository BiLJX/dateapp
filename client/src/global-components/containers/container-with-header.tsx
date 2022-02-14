import { NavLink, useLocation, useNavigate } from "react-router-dom"
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
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
    const urls = ["/", "/search", "/dates", "/library", "/profile"]
    const location = useLocation();
    const currentUser = useSelector((state: RootState)=>state.current_user);
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
            <NavLink to = "/library" className={(navData)=>"bottom-nav-item " + (navData.isActive?"bottom-nav-item-active":"")}>
                { /*currentUser?.library?.has_date_requests || currentUser?.library.has_notifications ? <span className = "alert-icon"></span> : null*/}
                <LibraryBooksIcon />
            </NavLink>
            <NavLink to = {"/user/"+currentUser?.uid} className={(navData)=>"bottom-nav-item " + (navData.isActive?"bottom-nav-item-active":"")}>
                <div className = "nav-profile">
                    <img className="full-img" src = {currentUser?.profile_picture_url}/>
                </div>
            </NavLink>
        </nav>
    )
}


export function Header({name, goBackButton = false}: {name: string, goBackButton?: boolean}){
    const navigate = useNavigate();
    return(
        <header className="main-header">
            <span>{name}</span>
            {goBackButton && (
                <div className="back-arrow-container" onClick = {()=>navigate(-1)}>
                    <ArrowBackIosIcon/>
                </div>
            )}
        </header>
    )
}

export default MainContainer
