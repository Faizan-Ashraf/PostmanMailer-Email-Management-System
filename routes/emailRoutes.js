import express from 'express';
const router = express.Router();
import Emails from '../models/emails.js';
import jwtAuthMiddleware from '../jwt.js';


router.post('/send', jwtAuthMiddleware.jwtAuthMiddleware, async (req, res) => {
    try {
        const userEmail = req.user.email;
        const { to, from, subject, mail } = req.body;

        if (from !== userEmail) {
            return res.status(403).json({ error: 'You can only send emails from your own email address.' });
        }

        const newMail = new Emails({ to, from, subject, mail });
        await newMail.save();
        console.log("Mail sent successfully!");
        res.status(200).json({ message: 'Mail sent successfully' });
    } catch (error) {
        console.error("Failed to send mail!", error);
        res.status(500).json({ error: 'An error occurred while sending this mail.' });
    }
});



router.get('/', jwtAuthMiddleware.jwtAuthMiddleware, async (req, res) => {
    try {
        const userEmail = req.user.email;
        const mails = await Emails.find({ to: userEmail });

        if (mails.length === 0) {
            return res.status(200).json({ message: 'Inbox is empty' });
        }

        res.status(200).json(mails);
    } catch (error) {
        console.error("Failed to fetch emails!", error);
        res.status(500).json({ error: 'An error occurred while fetching mails!' });
    }
});


router.get('/:email', jwtAuthMiddleware.jwtAuthMiddleware, async (req, res) => {
    try {
        const email = req.params.email;
        const requestedMails = await Emails.find({ from: email });

        if (requestedMails.length === 0) {
            return res.status(404).json({ message: "No emails found from this sender" });
        }

        res.status(200).json(requestedMails);
    } catch (error) {
        console.error("Error fetching mails!", error);
        res.status(500).json({ error: 'An error occurred while fetching mails!' });
    }
});


router.delete('/:id', jwtAuthMiddleware.jwtAuthMiddleware, async (req, res) => {
    try {
        const mailId = req.params.id;
        const response = await Emails.findByIdAndDelete(mailId);

        if (!response) {
            return res.status(404).json({ message: "Mail not found" });
        }

        console.log("Mail deleted successfully");
        res.status(200).json({ message: "Mail deleted successfully" });
    } catch (error) {
        console.error("Error deleting mail!", error);
        res.status(500).json({ error: 'Internal Server Error!' });
    }
});

export default router;
