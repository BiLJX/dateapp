import { FC, useState } from "react";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import "./styles.css";
import { Slider, Switch } from "@mui/material";

export const SettingsContainer: FC = ({children}) => {
    return(
        <div className="settings-container">
            {children}
        </div>
    )
}

interface OptionsData {
    value: string,
    placeholder: string
}

interface SettingsSelectProps {
    label: string,
    options: OptionsData[],
    onChange: (data: any) => any,
    defaultValue: string
}

export const SettingsSelect: FC<SettingsSelectProps> = (props) => {
    return(
        <div className="settings-item">
            <div className = "settings-item-top">
                <h2>{props.label}</h2>
            </div>
            <div className = "settings-item-main">
                <div className = "settings-item-select-container">
                    <select defaultValue={props.defaultValue} className="settings-item-select" onChange = {(e)=>props.onChange(e.target.value)}>
                        {props.options.map((data, i)=>(
                            <option key = {i} value = {data.value}>{data.placeholder}</option>
                        ))}
                    </select>
                    <div className = "settings-item-select-down">
                        <KeyboardArrowDownIcon />
                    </div>
                </div>
            </div>
        </div>
    )
}
const minDistance = 5;

interface RangeProps{
    min: number,
    max: number,
    initial_min: number;
    initial_max: number;
    onChange: (min: number, max: number) => any;
}

export const SettingsRange: FC<RangeProps> = (props) => {
    const [value, setValue] = useState<number[]>([props.initial_min, props.initial_max]);
    const handleChange = (event: Event, newValue: number | number[], activeThumb: number) => {
        if (!Array.isArray(newValue)) {
            return;
        }
        if (activeThumb === 0) {
            setValue([Math.min(newValue[0], value[1] - minDistance), value[1]])
            props.onChange(Math.min(newValue[0], value[1] - minDistance), value[1]);
        } else {
            setValue([value[0], Math.max(newValue[1], value[0] + minDistance)])
            props.onChange(value[0], Math.max(newValue[1], value[0] + minDistance));
        }
    };
    return(
        <div className="settings-item">
            <div className = "settings-item-top">
                <h2>Age range</h2>
            </div>
            <div className = "settings-item-main">
                <div style = {{padding: "0px 20px"}}>
                    <Slider
                    value={value}
                    onChange = {handleChange}
                    valueLabelDisplay = "auto"
                    min={props.min}
                    max={props.max}
                    color = "secondary"
                    marks = {[{value: 13, label: "13"}, {value: 50, label: "50"}]}
                    />
                </div>
               
            </div>
        </div>
    )
}

export const SettingsSwitch: FC<{checked: boolean, onChange: (state: boolean)=>any}> = (props) => {
    const [checked, setChecked] = useState(props.checked)
    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setChecked(event.target.checked);
        props.onChange(event.target.checked);
    }
    return(
        <div className="settings-item" style = {{flexDirection: "row"}}>
             <div className = "settings-item-left" style={{width: "85%"}}>
                <h2>Show your dates</h2>
            </div>
            <div className="settings-item-right">
                <Switch 
                checked = {checked}
                onChange = {onChange}
                />
            </div>
        </div>
    )
}

export const SettingsSaveButton = ({onClick}: {onClick: ()=>void}) => {
    return(
        <div className = "settings-save-button" onClick = {()=>onClick()}>
            Save
        </div>
    )
}