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

export function SpinLoader(){
    return(
        <div className="loader-full">
            <TailSpin color="var(--text-main)" height={80} width={80} />
        </div>
    )
}