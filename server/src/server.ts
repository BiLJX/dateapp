//apps
import express from "express"
import mongoose from "mongoose"
import { Server } from "socket.io"
import cookie from "cookie"
import path from "path"

//middlewares
import bodyParser from "body-parser"
import cors from "cors"
import cookieParser from "cookie-parser"
import { AuthMiddleware } from "./middleware/auth-middleware"

//routers
import AuthRoutes from "./routes/auth-routes"
import UserRoutes from "./routes/user-routes"
import DateRoutes from "./routes/dates-routes"
import { ChatRoutes } from "./routes/chat-routes"
import { PostRoutes } from "./routes/posts-routes"
import { ActiveUsers } from "./realtime/ActiveUsers"
import { getUid } from "./utils/uid"
import { Chat } from "./realtime/Chat"
import { HobbyRouter } from "./routes/hobby-routes"

//side effects
import "./fire"
import { redis_client } from "./redis-client"
import Notify from "./realtime/Notify"
import { NotificationsRouter } from "./routes/notification-routes"
import { SettingsRouter } from "./routes/settings-routes"
import { ExploreRouter } from "./routes/explore-routes"

//constants
const CONNECTION_URL = "mongodb+srv://billjesh:Billu456@cluster0.vyegx.mongodb.net/Dateapp?retryWrites=true&w=majority"
const PORT = process.env.PORT || 5000

//initializing app

const app = express()

//using middlewares

app.use(bodyParser.json())
app.use(cors({credentials: true, origin: true}));
app.use(cookieParser())
app.use(express.static(path.join("build")))

/*                routes              */

app.use("/api/auth",  AuthRoutes)
app.use("/api/user", AuthMiddleware, UserRoutes)
app.use("/api/explore", AuthMiddleware, ExploreRouter)
app.use("/api/date", AuthMiddleware, DateRoutes)
app.use("/api/chat", AuthMiddleware, ChatRoutes)
app.use("/api/posts", AuthMiddleware, PostRoutes)
app.use("/api/hobbies", AuthMiddleware, HobbyRouter)
app.use("/api/notifications", AuthMiddleware, NotificationsRouter)
app.use("/api/settings", AuthMiddleware, SettingsRouter)



app.get("/*", (req, res) => {
	res.sendFile(path.join(__dirname,"..", "build", "index.html"));
});

//connecting to database and starting server

mongoose.connect(CONNECTION_URL).then(async ()=>{
    await redis_client.connect();
    const server = app.listen(PORT, ()=>{
        console.log("listening on port "+PORT+"...")
    })
    const io = new Server(server);
    const activeUsers = new ActiveUsers()
    const chat = new Chat(activeUsers)
    const notification = new Notify(io)
    app.locals.notification = notification;
    io.on("connection", (socket)=>{

        const cookief = socket.handshake.headers.cookie||"";
        const cookies = cookie.parse(cookief) 
        const token = <string>socket.handshake.query.session || cookies.session || "";
        if(!token) return;
        const uid = getUid(token);
        if(!uid) return;
        socket.join(uid);
        activeUsers.addUser({ uid, socket_id: socket.id })
        chat.updateActiveUsers(activeUsers);
        chat.dmMessage(socket);
        chat.quickMessage(socket);
        socket.on("disconnect", ()=>{
            activeUsers.removeUser(socket.id);
            socket.leave(uid)
            chat.updateActiveUsers(activeUsers);
        })
    })
    app.locals.active_user_obj = activeUsers;
}).catch(err=>{
    console.log(err)
})