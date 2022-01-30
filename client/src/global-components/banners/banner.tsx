import "./banner.css"

export function ErrorBanner({msg}: {msg: string}){
    return(
        <article className="banner banner-error">
            {msg}
        </article>
    )
}