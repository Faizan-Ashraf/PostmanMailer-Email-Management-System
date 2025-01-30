import mongoose from "mongoose";
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    username: {type: String, require:true},
    email: {type: String, require:true, unique: true},
    password: {type: String, require:true},
})

userSchema.pre('save', async function(next){
    const user = this;
    if (!user.isModified('password')) {
        return next();
    }

    try {
        const salt = await bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash(user.password, salt);

        user.password = hashedPassword;

        next();
    } catch (error) {
        next(error);
    }
})

const User = mongoose.model('User',userSchema,'user');
export default User;
