import { NavLink, useLocation, useNavigate } from "react-router-dom"
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import "./container.css"
import { useSelector } from "react-redux";
import { RootState } from "types/states";

interface HeaderMapping {
    url: string
    header_title: string,
    go_back_buton: boolean,
    include_header: boolean,
    include_bottom_nav: boolean
}

function ContainerWithHeader({children}: {children?:JSX.Element}){
    return(
        <>
            <main className="main-container">
                {children}
            </main>
            <BottomNav />
        </>
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
                <LibraryBooksIcon />
            </NavLink>
            <NavLink to = "/profile" className={(navData)=>"bottom-nav-item " + (navData.isActive?"bottom-nav-item-active":"")}>
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

export default ContainerWithHeader
