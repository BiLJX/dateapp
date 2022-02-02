import "./banner.css"

export function Banner({msg, className}: {msg: string, className: string}){
    return(
        <article className={"banner "+className}>
            {msg}
        </article>
    )
}