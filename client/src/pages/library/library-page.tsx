import { Header } from "global-components/containers/container-with-header"
import { NavLink } from "react-router-dom"
import "./library-page.css"
function LibraryPage(){
    return (
        <>
            <Header name="Library" />
            <div className="library-page">
                <div className = "library-items-container">
                    <LibraryItems />
                    <LibraryItems />
                    <LibraryItems />
                    <LibraryItems noBorder/>
                </div>
            </div>
        </>
    )
}

function LibraryItems({noBorder = false}: {noBorder?: boolean}){
    return(
        <NavLink to = "/request/incomming" className="library-item" style={noBorder?{borderBottom: "none" }:{}}>
            <div className = "library-item-icon">

            </div>
            <div className = "library-item-title">

            </div>
            <div className = "library-item-forward">
                
            </div>
        </NavLink>
    )
}


export default LibraryPage