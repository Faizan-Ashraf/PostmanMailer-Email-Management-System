import express from 'express';
import passport from 'passport';
import User from './models/user.js';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';
const app = express();

passport.use(new LocalStrategy(
    async (username,password,done) => {
        try {
            console.log("Recieved Credientials: ",username,password);
            const user = await User.findOne({username:username});
            if (!user) {
                return done(null,false,{message: 'Incorrect Username'});
            }

            const isPasswordMatch = await bcrypt.compare(password, user.password);

            if (isPasswordMatch) {
                return done(null,user);
            }
            else{
                return done(null,false,{message: 'Incorrect Password'});
            }
        } catch (error) {
            return done(error);
        }
    }
))

app.use(passport.initialize());

const localAuthMiddleware = passport.authenticate('local',{session:false});

export default localAuthMiddleware;
