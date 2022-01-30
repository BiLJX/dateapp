import LoginPage from "./pages/auth/login-page"
import AppRouter from "./router/router"
import { ErrorBanner } from "./global-components/banners/banner"
import { useSelector } from "react-redux"
import { RootState } from "./types/states"
function App(){

  const { banner } = useSelector((state: RootState)=>state)
  return(
    <>
      <AppRouter />
      {banner.error_banner && <ErrorBanner msg={banner.message || ""}/>}
    </>
  )
}

export default App