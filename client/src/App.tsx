import AppRouter from "./router/router"
import { Banner, TextMessageBanner } from "./global-components/banners/banner"
import { useSelector } from "react-redux"
import { RootState } from "./types/states"
import { BrowserRouter as Router} from "react-router-dom"
import { useEffect } from "react"
import { FullScreen, useFullScreenHandle } from "react-full-screen";
function App(){
  const { banner } = useSelector((state: RootState)=>state);
  return(
    <Router>
      {banner.text_banner&&<TextMessageBanner message_obj= {banner.recent_msg_obj as any} />}
      {banner.error_banner && <Banner msg={banner.message || ""} className = "banner-error" />}
      {banner.success_banner && <Banner msg={banner.message || "success"} className = "banner-success" />}
      <AppRouter />
    </Router>
  )
}

export default App