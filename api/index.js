import express from 'express'
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/user.route.js';
import authRoute from './routes/auth.route.js'


dotenv.config();

mongoose
    .connect(process.env.MONGO)
    .then(
        ()  => { console.log('Mongodb is connected...') }
    )

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

app.use('/api/user', userRoutes); 
app.use('/api/auth',authRoute)
app.use((err,req,res,next) => {
    const statusCode = err.statusCode || 500
    const message = err.message || 'Internet Server Error'
    res.status(statusCode).json({
        success : false,
        statusCode,
        message
    });
});