import { useEffect } from "react";

export default function FeedAd(){
    useEffect(()=>{
        const win: any = window;
        try{
            (win.adsbygoogle = win.adsbygoogle || []).push({});
        }catch(err){
            console.log(err)
        }
        
    }, [])
    return(
        <div style={{display: "flex", minHeight: "100%", width: "300px", justifyContent: "center", alignItems: "center"}}>
            <ins 
            style={{display: "inline-block", width:"300px",height:"300px"}}
            data-ad-client="ca-pub-2377005438274418"
            data-ad-slot="6590556982"
            className="adsbygoogle"
            />
        </div>
    )
}