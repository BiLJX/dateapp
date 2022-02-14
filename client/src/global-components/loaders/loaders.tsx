import { height } from "@mui/system"
import { Hearts, TailSpin } from "react-loader-spinner"
import "./loader.css"
export function HeartLoader(){
    return(
        <div className="loader-full">
            <Hearts color="var(--pink)" />
        </div>
    )
}

export function SplashSceenLoader(){
    return(
        <div className="loader-full">
            <Hearts color="var(--pink)" height={160} width={160} />
            <h2 className = "spash-heading">Kura Kani</h2>
        </div>
    )
}

export function SpinLoader(props: any){
    return(
        <div className="loader-full">
            <TailSpin color={props.color||"var(--text-main)"} height={props.size||80} width={props.size||80} />
        </div>
    )
}