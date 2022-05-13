import CloseIcon from '@mui/icons-material/Close';
import { FormInput, FormSubmit } from 'pages/auth/components/form-components';
import TitleIcon from '@mui/icons-material/Title';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import { useEffect, useState } from 'react';
import Crop from 'global-components/crop/crop-component';
import { Area } from 'react-easy-crop/types';
import { postPicture } from 'api/post-api';
import { PicturePostSchema } from '@shared/PicturePost';
import { useDispatch } from 'react-redux';
import bannerDispatch from 'dispatcher/banner';
import { error } from 'action/banner';

interface PictureFormProps {
    close: () => any,
    onData: (data: PicturePostSchema) => any
}

export default function PictureForm(props: PictureFormProps){
    const [showCrop, setShowCrop] = useState(false);
    const [img_url, setImg_url] = useState("");
    const [img, setImg] = useState<File>();
    const [cropInfo, setCropInfo] = useState<Area>({x: 0, y: 0, height: 0, width: 0})
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()
    const handleFileChange = (e: any) => {
        const pfp = e.target.files[0];
        setImg_url(URL.createObjectURL(pfp))
        setImg(pfp)
        setShowCrop(true)
    }
    const onComplete = (info: Area) => {
        setCropInfo(info)
        setShowCrop(false)
    }
    const onSubmit = async (e: any) => {
        e.preventDefault();
        setLoading(true)
        if(!img) return;
        const caption = e.target.caption.value;
        const res = await postPicture(caption, img, cropInfo)
        setLoading(false)
        if(res.success){
            props.onData(res.data)
            return props.close()
        }
        bannerDispatch(dispatch, error(res.msg))
    }
    useEffect(()=>{
        document.body.style.overflow = "hidden"
        return(()=>{document.body.style.overflow = "unset"})
    }, [])
    return(
        <>
            { showCrop && <Crop aspectRatio={1/1} type='POST' image={img as File} on_reject = {()=>setShowCrop(false)} on_complete = {onComplete} /> }
            <div className="overlay picture-form-overlay">
                <header className = "picture-form-header">
                    <CloseIcon onClick = {props.close} />
                </header>
                <form className = "picture-form" onSubmit = {onSubmit}>
                    <div className = "picture-form-picture-container">
                        <input accept = "image/*" type = "file" id = "picture-form-input" onChange = {handleFileChange} hidden/>
                        <label htmlFor = "picture-form-input" className = "picture-form-picture-preview">
                            <div className='picture-form-upload-img'>
                                <FileUploadOutlinedIcon />
                            </div>
                            <img className = "full-img" src = {img_url} />
                        </label>
                    </div>
                    <FormInput name = "caption" Icon = {TitleIcon} placeholder = "Caption..." />
                    <FormSubmit isLoading = {loading} value = "POST" className = "no-margin" />
                </form>
            </div>
        </>
    )
}