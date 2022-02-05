import { UserDate } from "@shared/Dates";
export interface DateActionInterface {
    dates_arr: UserDate[],
    date: UserDate
}
export function initDates(dates: UserDate[]): ActionInterface<DateActionInterface>{
    return {
        type: "INIT_DATES",
        payload: {
            date: dates[0],
            dates_arr: dates
        }
    }
}

export function addDates(date: DateActionInterface): ActionInterface<DateActionInterface>{
    return {
        type: "ADD_DATE",
        payload: date
    }
}