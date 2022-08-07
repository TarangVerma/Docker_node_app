const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/userModel");
var cors = require("cors");

const { MONGO_USER, MONGO_PASSWORD, MONGO_IP, MONGO_PORT, SESSION_SECRET } = require("./config/config");


const session = require("express-session");
let RedisStore = require("connect-redis")(session);
const { createClient } = require("redis")
let redisClient = createClient({
  legacyMode: true ,
  url: 'redis://redis:6379',
});
redisClient.connect().catch(console.error)

const MONGO_URL =  `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`
const app = express();

const postRouter = require("./routs/postRoute");
const userRouter = require("./routs/userRoute");

app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret : SESSION_SECRET,
    cookie : {
      secure : false,
      resave : false ,
      saveUninitialized : false ,
      httpOnly : true ,
      maxAge : 60000 ,
  },
    
  })
);

const tryWithReconnect = () => {
    mongoose.connect(MONGO_URL)
    .then(() => console.log("successfully connected to db"))
    .catch((e) => {console.log(e)
    setTimeout(tryWithReconnect , 5000);}
    );
};

tryWithReconnect();

app.use(express.json());
app.use(cors({}))

app.enable("trust proxy");
app.get("/api/v1" ,  (req, res) => {
    res.send("<h2>HI There...</h2>")
    console.log("yeh it ran")
})

app.use("/api/v1/posts" , postRouter);
app.use("/api/v1/users" , userRouter);


const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`listening on port ${port}`)) 