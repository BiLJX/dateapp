//apps
import express from "express"
import mongoose from "mongoose"
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

//constants
const CONNECTION_URL = "mongodb+srv://billjesh:Billu456@cluster0.vyegx.mongodb.net/Dateapp?retryWrites=true&w=majority"
const PORT = process.env.PORT || 5000

//initializing app

const app = express()

//using middlewares

app.use(bodyParser.json())
app.use(cors({credentials: true, origin: true}));
app.use(cookieParser())

/*                routes              */

app.use("/api/auth",  AuthRoutes)
app.use("/api/user", AuthMiddleware, UserRoutes)
app.use("/api/date", AuthMiddleware, DateRoutes)
app.use("/api/chat", AuthMiddleware, ChatRoutes)
//connecting to database and starting server

mongoose.connect(CONNECTION_URL).then(()=>{
    app.listen(PORT, ()=>{
        console.log("listening on port "+PORT+"...")
    })
}).catch(err=>{
    console.log(err)
})