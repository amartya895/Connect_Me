import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import multer from 'multer';
import dotenv from 'dotenv';
import helmet  from 'helmet';
import morgan from 'morgan';
import path from 'path';
import {fileURLToPath} from 'url'
import { register } from './controllers/authController.js';
import { createPost } from './controllers/postController.js';
import authRoute from "./routes/authRoute.js";
import userRoute from "./routes/userRoute.js";
import postRoute from "./routes/postRoute.js";
import { verifyToken } from './middleware/authMiddleware.js';
import User from "./models/userModel.js";
import Post from "./models/postModel.js";

import {users , posts} from "./data/index.js";

// CONFIGURATION

const __filename = fileURLToPath(import.meta.url)

const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({"policy":"cross-origin"}));
app.use(morgan("common"));

app.use(bodyParser.json({limit:"30mb",extended:true}));
app.use(bodyParser.urlencoded({limit:"30mb",extended:true}));

app.use(cors());
app.use("/assets",express.static(path.join(__dirname,'public/assets')));

//file Storage

const storage = multer.diskStorage({
    destination:function(req , file , cb){
        cb(null, "public/assets");
    },
    filename : function(req , file , cb){
        cb(null , file.originalname);
    }
});

const upload = multer({storage});

//ROUTES with FIles

app.post("/api/auth/register",upload.single("picture"), register);
app.post("/api/posts",verifyToken ,upload.single("picture"),createPost);

//ROUTES
app.use("/api/auth" , authRoute);

app.use("/api/users" , userRoute);

app.use("/api/posts", postRoute);
//mongoose setup


const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URL ,{
    useNewUrlParser : true,
    useUnifiedTopology : true,
}).then(()=>{
    app.listen(PORT , ()=>{
        console.log(`Server is running on port : ${PORT}` );
    });
    // User.insertMany(users);
    // Post.insertMany(posts);
})
.catch((error)=>{
    console.log(`${error} connect failed`);
});