import express from 'express';
import User from '../models/users.js';
import jwtHelper from '../jwt.js';
import bcrypt from 'bcrypt';

const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const data = req.body;
        const newUser = new User(data);
        const response = await newUser.save();

        console.log("New User Added Successfully");
        res.status(200).json(response);
    } catch (error) {
        console.error("Error adding new user:", error);
        res.status(500).json({ message: 'Error adding new user', error });
    }
});


router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: 'Authentication failed. User not found.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Authentication failed. Wrong password.' });
        }

        const token = jwtHelper.generateToken({ email: user.email});
        res.status(200).json({ token });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: 'Error during login', error });
    }
});



export default router;
