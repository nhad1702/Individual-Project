import mongoose from 'mongoose'

const otpSchema = new mongoose.Schema({
    email: { type: String, required: true },
    pin: { type: String, required: true },
    type: { type: String, enum: ['verify', 'reset'], required: true },
    expiresAt: { type: Date, required: true }
}, { timestamps: true })

otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })
const otpModel = mongoose.model('Otps', otpSchema)
export default otpModel