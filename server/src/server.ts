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
//side effects
import "./fire"
import { ChatRoutes } from "./routes/chat-routes"
import { ActiveUsers } from "./realtime/ActiveUsers"
import { getUid } from "./utils/uid"
import { Chat } from "./realtime/Chat"

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
app.use("/api/date", AuthMiddleware, DateRoutes)
app.use("/api/chat", AuthMiddleware, ChatRoutes)
app.get("/*", (req, res) => {
	res.sendFile(path.join(__dirname,"..", "build", "index.html"));
});
//connecting to database and starting server

mongoose.connect(CONNECTION_URL).then(()=>{
    const server = app.listen(PORT, ()=>{
        console.log("listening on port "+PORT+"...")
    })
    const io = new Server(server);
    const activeUsers = new ActiveUsers()
    const chat = new Chat(activeUsers)
    io.on("connection", (socket)=>{
        const cookief = socket.handshake.headers.cookie||"";
        const cookies = cookie.parse(cookief) 
        const token = <string>socket.handshake.query.session || cookies.session || "";
        if(!token) return;
        const uid = getUid(token);
        if(!uid) return;
        activeUsers.addUser({ uid, socket_id: socket.id })
        chat.updateActiveUsers(activeUsers);
        chat.dmMessage(socket);
        socket.on("disconnect", ()=>{
            activeUsers.removeUser(socket.id)
            chat.updateActiveUsers(activeUsers);
        })
    })
}).catch(err=>{
    console.log(err)
})