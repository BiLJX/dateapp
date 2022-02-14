import { ContainerWithHeader, Header } from "global-components/containers/container-with-header";

export default function SoonPage(){
    return(
        <>
            <Header name = "Comming Soon" goBackButton />

                <div className="full error-page">
                    <h1>Comming Soon...</h1>
                </div>
        </>
    )
}