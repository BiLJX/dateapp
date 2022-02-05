import { UserDate } from "@shared/Dates";
import { DateActionInterface } from "action/date";

export function dateReducer(state: UserDate[] = [], action: ActionInterface<DateActionInterface>): UserDate[]{
    switch(action.type){
        case "INIT_DATES":
            return action.payload.dates_arr
        case "ADD_DATE":
            let copy = [...state];
            const userDate = action.payload.date;
            if(!Array.isArray(userDate) && copy.includes(userDate)){
                copy = copy.filter((x)=>x.date_user_uid !== userDate.date_user_uid);
            }
            copy.push(userDate)
            return copy;
        default:
            return state
    }
}