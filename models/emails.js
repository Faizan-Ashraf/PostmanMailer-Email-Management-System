import mongoose from "mongoose";

const projectsSchema = new mongoose.Schema({
    title:{type:String, required:true,unique:true},
    description:{type:String, required:true},
    studentId:{type: mongoose.Schema.Types.ObjectId, ref:'users', unique:true},
    supervisorId:{type: mongoose.Schema.Types.ObjectId, ref:'users'},
    status:{type:String,enum: ["proposed","completed"], required:true}
})

const Projects = mongoose.model('Projects',projectsSchema,'projects');

export default Projects;
