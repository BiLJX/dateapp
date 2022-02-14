import { SpinLoader } from "global-components/loaders/loaders"
import { Fragment } from "react"
import "./form-components.css"

export function AuthPageContainer(props: any){
    return(
        <div id="auth-page">
            {props.children}
        </div>
    )
}

export function AuthHeader({heading}:{heading: string}){
    return(
        <div className="auth-page-header">
            <h2>{heading}</h2>
        </div>
    )
}

interface FormInputProps {
    name: string, 
    placeholder: string, 
    Icon: any, 
    type?: string, 
    value?: string
    onChange?: (value: string)=>any
}

export function FormInput({name, placeholder, Icon, type, value, onChange}: FormInputProps){
    return(
        <div className="form-input-container">
            <div className="form-input-icon-container">
               <Icon />
            </div>
            <input onChange = {(e)=>onChange?.(e.target.value)} value = {value} className="form-input" placeholder={placeholder} name = {name} type={type}/>
        </div>
    )
}

export function FormTextArea({name, placeholder, Icon, value, onChange}: {name: string, placeholder: string, Icon: any, value?: string, onChange?: (value: string)=>any}){
    return(
        <div className="form-input-container">
            <div className="form-input-icon-container">
               <Icon />
            </div>
            <textarea onChange = {(e)=>onChange?.(e.target.value)} value={value} className="form-input form-text-area" placeholder={placeholder} name = {name}/>
        </div>
    )
}

export function FormSubmit({value, isLoading, className, disabled}: {value: string, isLoading?: boolean, className?: string, disabled?: boolean}){
    if(disabled){
        return(
            <div className={"form-submit form-submit-disabled " + className}>{value}</div>
        )
    }
    
    if(isLoading){
        return(
            <div className={"form-submit form-submit-disabled " + className}>
                <SpinLoader size = {40} />
            </div>
        )
    }
    return(
        <input type = "submit" className={"form-submit "+className} value={value}/>
    )
}


export interface SelectOptionData {
    value: string,
    option: string
}

export function SelectOption({data, select_name, Icon, value, onChange}: {data: SelectOptionData[], select_name: string, Icon: any, value?: string, onChange?: (val: string)=>any}){
    return(
        <div className="form-input-container">
            <div className="form-input-icon-container">
               <Icon />
            </div>
            <select className="form-input" name = {select_name} value = {value} onChange={(e:any)=>onChange?.(e.target.value)}>
               {
                   data.map((x, i)=>(
                       <Fragment key = {i}>
                           <option value={x.value}>{x.option}</option>
                       </Fragment>
                   ))
               }
            </select>
        </div>
    )
}

