const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const userRouter = require('./Router/router')
require('dotenv').config();

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.use('/api', userRouter)

const start = async () => {
    try {
        await mongoose.connect(process.env.DB_URL,{
            useNewUrlParser : true,
            useUnifiedTopology : true
        });
        app.listen(PORT,() => {
            console.log(`Server started on ${PORT} port`);
        })
    } catch (error) {
        console.log(error);
    }
}

start();