import AppRouter from "./router/router"
import { Banner } from "./global-components/banners/banner"
import { useSelector } from "react-redux"
import { RootState } from "./types/states"
import { useEffect } from "react"
import { FullScreen, useFullScreenHandle } from "react-full-screen";
function App(){
  const { banner } = useSelector((state: RootState)=>state)
  return(
    <>
      {banner.error_banner && <Banner msg={banner.message || ""} className = "banner-error" />}
      {banner.success_banner && <Banner msg={banner.message || "success"} className = "banner-success" />}
      <AppRouter />
    </>
  
  )
}

export default App