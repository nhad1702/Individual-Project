import fileUploadModel from "../Models/fileUpload.models.js";

const fileUploadController = {
    uploadFile: async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({
                    message: "No file uploaded"
                });
            }

            const newFile = await fileUploadModel.create({
                userId: req.account?._id,

                originalName: req.file.originalname,

                fileUrl: req.file.path,

                publicId: req.file.filename,

                fileType: req.file.mimetype
            });

            return res.status(201).json({
                message: "File uploaded successfully",
                file: newFile
            });
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message })
        }
    }
}

export default fileUploadController;