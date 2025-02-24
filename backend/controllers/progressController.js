import mongoose from 'mongoose';
import StudentProgress from '../models/StudentProgress.js';

export const saveProgress = async (req, res) => {
    try {
        const studentId = req.user._id; // Get studentId from authenticated user
        let { unitId, subtopicsId } = req.body;

        console.log('Received progress data:', { unitId, subtopicsId });

        // Validate `unitId`
        if (!unitId) {
            return res.status(400).json({ error: 'Missing unitId' });
        }

        // Validate `subtopicsId`
        if (!Array.isArray(subtopicsId) || subtopicsId.length === 0) {
            return res.status(400).json({ error: 'Missing or invalid subtopicsId' });
        }

        // Convert `unitId` to ObjectId
        try {
            unitId = new mongoose.Types.ObjectId(unitId);
        } catch (error) {
            return res.status(400).json({ error: 'Invalid unitId format' });
        }

        // Convert each subtopicId to ObjectId
        try {
            subtopicsId = subtopicsId.map(id => new mongoose.Types.ObjectId(id));
        } catch (error) {
            return res.status(400).json({ error: 'Invalid subtopicsId format' });
        }


        let progress = await StudentProgress.findOne({ studentId });

        if (!progress) {
            progress = new StudentProgress({ studentId, progress: [] });
        }

        if (!Array.isArray(progress.progress)) {
            progress.progress = [];
        }

        subtopicsId.forEach(subtopic => {

            const exists = progress.progress.some(p =>
                p.unitId?.toString() === unitId.toString() &&
                p.subtopicId?.toString() === subtopic.toString()
            );

            if (!exists) {

                // Ensure we're adding correct values
                if (!unitId || !subtopic) {
                    console.error('ERROR: unitId or subtopicId is undefined before saving:', { unitId, subtopic });
                    return;
                }

                progress.progress.push({ unitId, subtopicId: subtopic });
            } else {
                console.log('Progress entry already exists, skipping:', { unitId, subtopicId: subtopic });
            }
        });

        
        await progress.save();
        res.status(200).json({ message: 'Progress saved successfully' });

    } catch (error) {
        console.error('Error saving progress:', error);
        res.status(500).json({ error: 'Failed to save progress', details: error.message });
    }
};


export const getStudentProgress = async (req, res) => {
    try {
        const studentId = req.user._id;

        // Find the student's progress document
        const progress = await StudentProgress.findOne({ studentId });

        if (!progress || progress.progress.length === 0) {
            return res.status(404).json({ message: 'No progress found for this student' });
        }

        // Filter and return only the completed subtopics
        const completedSubtopics = progress.progress.map(p => ({
            unitId: p.unitId,
            subtopicId: p.subtopicId
        }));

        res.status(200).json({ studentId, progress: completedSubtopics });

    } catch (error) {
        console.error('Error fetching progress:', error);
        res.status(500).json({ error: 'Failed to fetch progress', details: error.message });
    }
};
