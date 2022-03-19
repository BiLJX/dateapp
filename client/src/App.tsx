import AppRouter from "./router/router"
import { Banner, TextMessageBanner } from "./global-components/banners/banner"
import { useSelector } from "react-redux"
import { RootState } from "./types/states"
import { BrowserRouter as Router} from "react-router-dom"
import { ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';
function App(){
  const { banner } = useSelector((state: RootState)=>state);
  return(
    <Router>
      <ToastContainer limit={1} />
      {banner.text_banner&&<TextMessageBanner message_obj= {banner.recent_msg_obj as any} />}
      {banner.error_banner && <Banner msg={banner.message || ""} className = "banner-error" />}
      {banner.success_banner && <Banner msg={banner.message || "success"} className = "banner-success" />}
      
      <AppRouter />
    </Router>
  )
}

export default App