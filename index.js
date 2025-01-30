import express from 'express';
import mongoose from 'mongoose';
import db from './db.js';
import projectsRoutes from './routes/projectRoutes.js';
import UserRoutes from './routes/userRoutes.js'
import bodyParser from 'body-parser';
const PORT= 3000;

const app = express();


app.use(bodyParser.json());
app.use('/user',UserRoutes);
app.use('/projects',projectsRoutes);

app.listen(PORT,()=>{
    console.log("Server is Open Now!");
})
