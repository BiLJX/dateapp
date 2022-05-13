import { useEffect, useState } from "react";
import Cropper from "react-easy-crop";
import CloseIcon from '@mui/icons-material/Close';
import DoneIcon from '@mui/icons-material/Done';
import { Area, Point } from "react-easy-crop/types";
import "./crop.css"
import { updateCover, updatePfp } from "api/user-api";
import bannerDispatch, { toastError } from "dispatcher/banner";
import { useDispatch } from "react-redux";
import { error } from "action/banner";
import { TailSpin } from "react-loader-spinner"

interface CropProps {
    image: File,
    type: "PFP"|"POST"|"COVER",
    on_complete: (data: any) => any,
    on_reject: () => any,
    aspectRatio?: number
}

export default function Crop(props: CropProps){
    const [crop, setCrop] = useState<Point>({x: 0, y: 0})
    const [zoom, setZoom] = useState(1)
    const [cropInfo, setCropInfo] = useState<Area>();
    const [image_url] = useState(URL.createObjectURL(props.image))
    const [isLoading, setIsLoading] = useState(false)
    const dispatch = useDispatch();
    useEffect(()=>{
        document.body.style.overflow = "hidden"
        return(()=>{document.body.style.overflow = "unset"})
    }, [])
    const save = async () => {
        setIsLoading(true)
        if(!cropInfo) return;
        let res: ApiResponse<{url: string}>;
        switch(props.type){
            case "PFP":
                res = await updatePfp(props.image, cropInfo);
                if(res.success){
                    return props.on_complete(res.data.url)
                }
                toastError(res.msg);
                break;
            case "COVER":
                res = await updateCover(props.image, cropInfo);
                if(res.success){
                    return props.on_complete(res.data.url)
                }
                toastError(res.msg)
                break;
            case "POST":
                props.on_complete(cropInfo);
                break;
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
                aspect={props.aspectRatio || 9/16}
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