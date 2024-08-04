import express from 'express'
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/user.route.js';
import authRoute from './routes/auth.route.js'
import postRount from './routes/post.route.js'
import commentRount from './routes/comment.route.js'
import cookieParser from 'cookie-parser';



dotenv.config();

mongoose
    .connect(process.env.MONGO)
    .then(
        ()  => { console.log('Mongodb is connected...') }
    )

const app = express();
app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

app.use('/api/user', userRoutes); 
app.use('/api/auth',authRoute); 
app.use('/api/post',postRount);
app.use('/api/comment',commentRount);
app.use((err,req,res,next) => {
    const statusCode = err.statusCode || 500
    const message = err.message || 'Internet Server Error'
    res.status(statusCode).json({
        success : false,
        statusCode,
        message
    });
});