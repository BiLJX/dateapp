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
            <h1 className = "spash-heading">Affexon</h1>
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