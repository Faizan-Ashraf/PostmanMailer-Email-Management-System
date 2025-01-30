import express from 'express';
const router = express.Router();
import Emails from '../models/emails.js';
import jwtAuthMiddleware from '../jwt.js';
import User from '../models/users.js';
import Mails from '../models/emails.js';

router.post('/send', jwtAuthMiddleware.jwtAuthMiddleware, async (req, res) => {
    try {
        const data = req.body;
        const newMail = new Emails(data);
        const response = await newMail.save();
        console.log("Mail send Successfully!");
        res.status(200).json({Message: 'Mail Send Successfully'}, response);
    } catch (error) {
        console.log("Failed!", error);
        res.status(500).json({ error: 'An error occurred while sending this mail.' });
    }
});


router.get('/', jwtAuthMiddleware.jwtAuthMiddleware, async (req, res) => {
    try {
        
        mails = await Mails.find({ to: User.email });
        res.status(200).json(mails);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'An error occurred while fetching mails!' });
    }
});


router.get('/:email', jwtAuthMiddleware.jwtAuthMiddleware, async (req, res) => {
    try {
        const projectId = req.params.id;
        let project;
        if (req.user.role === 'student') {
            project = await Projects.findOne({ _id: projectId, studentId: req.user._id });
        } else if (req.user.role === 'supervisor') {
            project = await Projects.findById(projectId);
        }

        if (!project) {
            return res.status(404).json("Data not Found");
        }

        res.status(200).json(project);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'An error occurred while fetching the project!' });
    }
});

router.put('/:id', jwtAuthMiddleware.jwtAuthMiddleware, isSupervisor, async (req, res) => {
    try {
        const projectId = req.params.id;
        const updatedData = req.body;
        const response = await Projects.findByIdAndUpdate(projectId, updatedData, {
            new: true,
            runValidators: true,
        });

        if (!response) {
            return res.status(404).json("Data not Found");
        }

        console.log("Data Updated Successfully");
        res.status(200).json(response);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error!' });
    }
});

router.delete('/:id', jwtAuthMiddleware.jwtAuthMiddleware, isSupervisor, async (req, res) => {
    try {
        const projectId = req.params.id;
        const response = await Projects.findByIdAndDelete(projectId);
        if (!response) {
            return res.status(404).json("Data not Found");
        }

        console.log("Data Deleted Successfully");
        res.status(200).json(response);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error!' });
    }
});

export default router;

