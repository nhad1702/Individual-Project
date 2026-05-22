import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import rootRouter from './Routes/index.js';

dotenv.config();

const app = express();
const corsOptions = {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    accessControlAllowCredentials: true
}

app.use(express.json());
app.use(cors(corsOptions));

app.use('/api', rootRouter);
app.get('/', (req, res) => {
    res.send('Welcome to the API');
})

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log('MongoDB connected!')
            console.log(`🚀 Server is running at http://localhost:${process.env.PORT}`)
        })
    })
    .catch((err) => { console.log(`MongoDB error:`, err.message) })