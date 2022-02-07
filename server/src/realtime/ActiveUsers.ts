export interface ActiveUsersInterface {
    uid: string,
    socket_id: string
}

export class ActiveUsers {
    private _active_users: ActiveUsersInterface[] = [];
    private _user_map: any = {}
    public addUser(user: ActiveUsersInterface){
        !this._active_users.some(active_user=>active_user.uid === user.uid) && this._active_users.push(user);
        this._user_map[user.uid] = user.socket_id;
    }
    public removeUser(socket_id: string){
        this._active_users = this._active_users.filter(user=>user.socket_id !== socket_id);
    }
    public getUserByUid(uid: string){
        return this._user_map[uid];
    }
    public getUserBySocketId(socket_id: string){
        return this._active_users.find(x=>x.socket_id === socket_id)
    }
    get active_users(){
        return this._active_users
    }
}