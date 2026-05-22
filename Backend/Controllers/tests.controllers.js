import { get } from 'mongoose';
import testModel from '../Models/tests.models.js';

const testController = {
    createTest: async (req, res) => {
        const { title, userId, timeLimit, visibility } = req.body;
        if (!title || !userId) {
            return res.status(400).json({
                success: false,
                message: "Title and userId are required"
            });
        }

        try {
            const newTest = new testModel({
                title,
                userId,
                timeLimit: timeLimit || 0,
                visibility: visibility || "private"
            });
            const savedTest = await newTest.save();
            return res.status(201).json({
                success: true,
                message: "Test created successfully",
                data: savedTest
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Error creating test",
                error: error.message
            });
        }
    },
    getAllTests: async (req, res) => {
        try {
            const tests = await testModel.find();
            return res.status(200).json({
                success: true,
                message: "Tests fetched successfully",
                data: tests
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Error fetching tests",
                error: error.message
            });
        }
    },
    getTestById: async (req, res) => {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Test ID is required"
            });
        }
        try {
            const test = await testModel.findById(id);
            if (!test) {
                return res.status(404).json({
                    success: false,
                    message: "Test not found"
                });
            }
            return res.status(200).json({
                success: true,
                message: "Test fetched successfully",
                data: test
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Error fetching test",
                error: error.message
            });
        }
    },
    updateTest: async (req, res) => {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Test ID is required"
            });
        }

        try {
            const existingTest = await testModel.findById(id);
            if (!existingTest) {
                return res.status(404).json({
                    success: false,
                    message: "Test not found"
                });
            }

            const { title, timeLimit, visibility } = req.body;
            const updatedTest = await testModel.findByIdAndUpdate(
                id,
                { title, timeLimit, visibility },
                { new: true }
            );
            return res.status(200).json({
                success: true,
                message: "Test updated successfully",
                data: updatedTest
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Error updating test",
                error: error.message
            });
        }
    },
    deleteTest: async (req, res) => {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Test ID is required"
            });
        }

        try {
            const deletedTest = await testModel.findByIdAndDelete(id);
            if (!deletedTest) {
                return res.status(404).json({
                    success: false,
                    message: "Test not found"
                });
            }
            return res.status(200).json({
                success: true,
                message: "Test deleted successfully",
                data: deletedTest
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Error deleting test",
                error: error.message
            });
        }
    }
}

export default testController;