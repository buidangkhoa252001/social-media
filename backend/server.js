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
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', "*");

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Private-Network', true);

    // Pass to next layer of middleware
    next();
});
const corsOptions = {
  credentials: true,
  origin: "https://melodious-clafoutis-829a86.netlify.app",
  optionSuccessStatus: 200,
};
app.use(express.json())

app.use(cors(corsOptions));
app.use(cookieParser())


// Socket
const http = require('http').createServer(app)
/* const io =  new Server(http, {
  cors: {
    origin: "*",
  },
}) */
/* var io = new Server(http, {log:false, origins:'*:*'}); */
/* const io =  new Server(http,{origin:'http://localhost:3000'}) */
const io = require("socket.io")(http, {
  cors: {
    origin: ['http://localhost:3000','http://43.206.152.41','https://melodious-clafoutis-829a86.netlify.app'],
    /*  origin: "*", */
    methods: ["GET", "POST"],
     credentials: true,
     
  }
});

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

const _dirname = path.dirname("")
const buildPath = path.join(_dirname, "../client/build");
app.use(express.static(buildPath))
app.get("/*", function(req, res){

    res.sendFile(
        path.join(__dirname, "../client/build/index.html"),
        function (err) {
          if (err) {
            res.status(500).send(err);
          }
        }
      );

})
const URI = process.env.MONGODB_URL
mongoose.connect(URI, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
}, err => {
    if(err) throw err;
    console.log('Connected1 to mongodb')
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