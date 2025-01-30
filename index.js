//index.js
import express from 'express';
import mongoose from 'mongoose';
import db from './db.js';
import emailRoutes from './routes/emailRoutes.js';
import UserRoutes from './routes/userRoutes.js'
import bodyParser from 'body-parser';
const PORT= 3000;

const app = express();


app.use(bodyParser.json());
app.use('/user',UserRoutes);
app.use('/emails',emailRoutes);

app.listen(PORT,()=>{
    console.log("Server is Open Now!");
})
