require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const SocketServer = require('./socketServer')
const { Server }  = require("socket.io");
const { ExpressPeerServer } = require('peer')
const path = require('path')


const app = express()
const corsOptions = {
  credentials: true,
  origin: "http://localhost:3000",
  optionSuccessStatus: 200,
};
app.use(express.json())

app.use(cors(corsOptions));
app.use(cookieParser())


// Socket
const http = require('http').createServer(app)
const io =  new Server(http, {
  cors: {
    origin: "*",
  },
})

io.on('connection', socket => {
    SocketServer(socket)
})

// Create peer server
ExpressPeerServer(http, { path: '/' })

// Routes
app.use('/api', require('./routes/authRouter'))
app.use('/api', require('./routes/userRouter'))
app.use('/api', require('./routes/postRouter'))
app.use('/api', require('./routes/commentRouter'))
app.use('/api', require('./routes/notifyRouter'))
app.use('/api', require('./routes/messageRouter'))

const buildPath = path.join(__dirname,"../client/build")
 app.use(express.static(buildPath))
app.get("/*",function(req,res){
  res.sendFile(
    path.join(__dirname, "../client/build/index.html"),
    function(err){
      if(err){
        res.status(500).send(err)
      }
    }
  )
})
const URI = process.env.MONGODB_URL
mongoose.connect(URI, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
}, err => {
    if(err) throw err;
    console.log('Connected to mongodb')
})

/* if(process.env.NODE_ENV === 'production'){
    app.use(express.static('client/build'))
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'))
    })
} */


const port = process.env.PORT || 5000
http.listen(port, () => {
    console.log('Server is running on port', port)
})