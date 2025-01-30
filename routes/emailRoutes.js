import express from 'express';
const router = express.Router();
import emails from '../models/emails.js';
import jwtAuthMiddleware from '../jwt.js';
import User from '../models/users.js';

const isStudent = (req, res, next) => {
    if (req.user.role !== 'student') {
        return res.status(403).json({ error: 'Access denied. Only students can perform this action.' });
    }
    next();
};

const isSupervisor = (req, res, next) => {
    if (req.user.role !== 'supervisor') {
        return res.status(403).json({ error: 'Access denied. Only supervisors can perform this action.' });
    }
    next();
};

router.post('/', jwtAuthMiddleware.jwtAuthMiddleware, isStudent, async (req, res) => {
    try {
        const data = req.body;
        data.studentId = req.user._id; // Automatically set the studentId to the logged-in user
        const newProject = new Projects(data);
        const response = await newProject.save();
        console.log("Project Added Successfully!");
        res.status(200).json(response);
    } catch (error) {
        console.log("Failed!", error);
        res.status(500).json({ error: 'An error occurred while adding the project.' });
    }
});

router.get('/', jwtAuthMiddleware.jwtAuthMiddleware, async (req, res) => {
    try {
        let projects;
        if (req.user.role === 'student') {
            projects = await Projects.find({ studentId: req.user._id });
        } else if (req.user.role === 'supervisor') {
            projects = await Projects.find();
        }

        if (!projects || projects.length === 0) {
            return res.status(404).json("Data not Found or Empty Data");
        }

        res.status(200).json(projects);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'An error occurred while fetching data!' });
    }
});

router.get('/:id', jwtAuthMiddleware.jwtAuthMiddleware, async (req, res) => {
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
