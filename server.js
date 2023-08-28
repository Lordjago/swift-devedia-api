import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import colors from 'colors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import connectDB from './config/db.js'
import config from './config/index.js';
import authRoutes from './routes/auth.js'
import userRoutes from './routes/users.js'
import postRoutes from './routes/posts.js'
import User from './models/User.js';
import Post from './models/Posts.js';
import {users, posts } from './data/index.js'

/* CONFIGRATIONS */

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename);
dotenv.config({path: "./config/.env"})
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({policy: "cross-origin"}))
app.use(morgan("common"))
app.use(bodyParser.json({limit: "30mb", extended: true}));
app.use(bodyParser.urlencoded({limit: "30mb", extended: true}))
app.use(cors());
app.use('/assets', express.static(path.join(__dirname, 'public/assets')));

/* FILE STORAGE */
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/assets')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
        cb(null, true)
    } else {
        cb(null, false)
    }
}

/* DB CONNECTION */
connectDB()
// .then(() => {
//     User.insertMany(users)
//     Post.insertMany(posts)
// })
/* Mount Multer */
app.use(multer({
    storage: storage,
    fileFilter: fileFilter
}).single('image'))

/* Root route of express app */
app.get("/", (req, res, next) => {
  res.send("You've gotten to the root route");
});
/* Mount routers */

app.use('/auth', authRoutes)
app.use('/users', userRoutes)
app.use('/posts', postRoutes)

const server = app.listen(config.PORT, console.log(colors.green(`Server running on ${process.env.NODE_ENV} mode on port ${process.env.PORT}`.underline)));

// Handle global unhandled promise rejections
process.on("unhandledRejection", (err, data) => {
    console.log(`Error: ${err.message}`.red);
    server.close(() => process.exit(1));
  });