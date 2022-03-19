import SearchIcon from '@mui/icons-material/Search';
import { HobbySchema } from '@shared/User';
import { addCurrentUser } from 'action/user';
import { addHobby, getHobbies, removeHobby } from 'api/hobby-api';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from 'types/states';
import { Bubble } from './user-interests';

export default function HobbySearch(){
    const [hobbies, setHobbies] = useState<HobbySchema[]>([]);
    const navigate = useNavigate();
    const user = useSelector((state: RootState)=>state.current_user)
    async function search(s: string){
        const res = await getHobbies(s);
        if(res.success){
            setHobbies(res.data)
        }
    }
    useEffect(()=>{
        search("")
    }, [])
    return(
        <div className="hobby-search-page">
                <header className = "hobby-search-header">
                    <div className = "hobby-search-bar">
                        <div className = "hobby-search-bar-icon">
                            <SearchIcon />
                        </div>
                        <input type= "text" placeholder="Search for hobbies" onChange={(e)=>search(e.target.value)}/>
                    </div>
                    <div className="hobby-search-cancel" onClick={()=>navigate(-1)}>
                        Done
                    </div>
                </header>
                <div className = "hobby-item-container">
                    { hobbies.map((x, i)=>(<HobbyItem hobby = {x} key = {i}/>)) }
                </div>
        </div>  
    )
}

function HobbyItem({hobby}: {hobby: HobbySchema}){
    const [added, setAdded] = useState(hobby.does_user_have_this_hobby);
    const user = useSelector((state: RootState)=>state.current_user);
    useEffect(()=>{
        setAdded(hobby.does_user_have_this_hobby)
    }, [hobby])
   
    const dispatch = useDispatch()
    const add = async () => {
        setAdded(true)
        await addHobby(hobby.name)
        user && dispatch(addCurrentUser({...user, hobbies: [...user.hobbies, hobby.name]}))
    }
    const remove = async () => {
        setAdded(false);
        await removeHobby(hobby.name);
        if(!user) return
        let hobbies = [...user?.hobbies];
        hobbies = hobbies.filter(x=>x !== hobby.name);
        dispatch(addCurrentUser({...user, hobbies}))
    }
    return(
        <div className='hobby-search-item'>
            <div className = "hobby-search-item-name">{hobby.name}</div>
            <div className = "hobby-search-item-button">
                {added?<Bubble  onClick={remove} className='remove'>Remove</Bubble>:<Bubble onClick = {add}>Add</Bubble>}
            </div>
        </div>
    )
}