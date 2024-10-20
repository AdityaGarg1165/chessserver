require("dotenv").config()
const express = require("express")
const http = require("http")
const {Server} = require("socket.io")
const GameManager =  require('./GameManager')


const app = express()
const server = http.createServer(app)
const io = new Server(server,
    {
        cors: {
            origin: "*", // Change this to your client's origin
            methods: ["GET", "POST"],
            credentials: true 
        }
    }
)
const PORT = process.env.PORT || 3000
const gameManger = new GameManager()


io.on("connection",(socket)=>{
    gameManger.addUser(socket)    
    console.log(`User Connected with socket id:${socket.id}`)
})



server.listen(PORT,()=>{
    console.log(`Server is running on http://localhost:${PORT}`)
})
