import { UserInterface } from "@shared/User";
import moment from "moment";

interface MatchUser extends UserInterface{
    age: number,
    score: number
}


const weights = {
    interest_weight: 1,
    age_weight: 0.5
}

/*
    FORMULA: 
    score = matching_interest X interest_weight - age_diff X age_weight
*/
export class Match {
    private currentUser: MatchUser;
    private users: MatchUser[];
    constructor(currentUser: UserInterface, users: UserInterface[]){
        this.currentUser = {...currentUser, age: 0, score: 0};
        this.users = users.map(x=>({...x, age: 0, score: 0}));
    }
    public calcScore(){
        const users = this.users;
        const current_user = this.currentUser
        for(let user of users){
            user.age = this.getAge(user.birthday)
            current_user.age = this.getAge(current_user.birthday)
            //calculating matching hobbies
            const user_hobbies = user.hobbies;
            const current_user_hobbies = current_user.hobbies;
            const matching_hobbies: string[] = [];
           
            for(let hobby of user_hobbies){
                
                if(current_user_hobbies?.includes(hobby)){
                    
                    matching_hobbies.push(hobby)
                }
            }
            const n_hobby_matches = matching_hobbies.length;
            const age_diff = Math.abs( user.age - current_user.age ) + 1;
            user.score = (n_hobby_matches * weights.interest_weight) - (age_diff * weights.age_weight)
        }
    }
    public sort(){
        function quicksort(array: MatchUser[]): MatchUser[]{
            if (array.length <= 1) {
              return array;
            }
            let pivot = array[0];
            
            let left = []; 
            let right = [];
          
            for (let i = 1; i < array.length; i++) {
              array[i].score > pivot.score ? left.push(array[i]) : right.push(array[i]);
            }
            return quicksort(left).concat(pivot, quicksort(right));
        };
        const arr = quicksort(this.users)
        this.users = arr
    }
    private getAge(birthday: string){
        const now = moment(new Date());
        const _birthday = moment(birthday);
        const years = Math.floor(moment.duration(now.diff(_birthday)).asYears());
        return years
    }
    get matching_users(){
        return this.users.map(x=>x.uid)
    }
}