import mongoose from "mongoose";

const mailsSchema = new mongoose.Schema({
    to:{type:String, required:true},
    from:{type:String, required:true},
    subject:{type:String,required:true},
    mail:{type: String, required: true},
})

const Mails = mongoose.model('Mails',projectsSchema,'mails');

export default Mails;
