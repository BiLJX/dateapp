import LoginPage from "./pages/auth/login-page"
import AppRouter from "./router/router"
import { Banner } from "./global-components/banners/banner"
import { useSelector } from "react-redux"
import { RootState } from "./types/states"
function App(){

  const { banner } = useSelector((state: RootState)=>state)
  return(
    <>
      <AppRouter />
      {banner.error_banner && <Banner msg={banner.message || ""} className = "banner-error" />}
      {banner.success_banner && <Banner msg={banner.message || "success"} className = "banner-success" />}
    
    </>
  )
}

export default App