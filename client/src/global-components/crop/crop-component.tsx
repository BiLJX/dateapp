import { useState } from "react";
import Cropper from "react-easy-crop";
import CloseIcon from '@mui/icons-material/Close';
import DoneIcon from '@mui/icons-material/Done';
import { Area, Point } from "react-easy-crop/types";
import "./crop.css"
import { updatePfp } from "api/user-api";
import bannerDispatch from "dispatcher/banner";
import { useDispatch } from "react-redux";
import { error } from "action/banner";
import { TailSpin } from "react-loader-spinner"

interface CropProps {
    image: File,
    type: "PFP"|"POST",
    on_complete: (url: string) => any,
    on_reject: () => any
}

export default function Crop(props: CropProps){
    const [crop, setCrop] = useState<Point>({x: 0, y: 0})
    const [zoom, setZoom] = useState(1)
    const [cropInfo, setCropInfo] = useState<Area>();
    const [image_url] = useState(URL.createObjectURL(props.image))
    const [isLoading, setIsLoading] = useState(false)
    const dispatch = useDispatch()
    const save = async () => {
        setIsLoading(true)
        if(!cropInfo) return;
        if(props.type === "PFP"){
            const res = await updatePfp(props.image, cropInfo);
            if(res.success){
                return props.on_complete(res.data.url)
            }
            bannerDispatch(dispatch, error(res.msg))
        }
        setIsLoading(false)
    }
    return(
        <div className="overlay crop-overlay">
            <div className = "crop-container">
                <header className="crop-header">
                    <div className="crop-header-left" onClick = {props.on_reject}>
                        <CloseIcon  />
                    </div>
                    <div className="crop-header-right" onClick = {save}>
                        { isLoading? <TailSpin height={24} width = {24} color = "var(--text-main" />  :<DoneIcon />}
                    </div>
                </header>
                <Cropper 
                image={image_url}
                aspect={16/20}
                onCropChange = {setCrop}
                crop = {crop}
                zoom = {zoom}
                onZoomChange = {setZoom}
                onCropComplete = {(data)=>setCropInfo(data)}
                />
            </div>
        </div>
    )
}