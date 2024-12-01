import mongoose from 'mongoose';

const MailServiceSchema = new mongoose.Schema({
    // Reference to the PlatformMailService model
    platform: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "PlatformMailService", // Referring to the PlatformMailService model
        required: true 
    },
    codes: [
        { 
            code: { type: String, required: true }, 
            value: { type: String, required: true } 
        }
    ],
    isVerified: { 
        type: Boolean, 
        default: false 
    }
});

export default mongoose.models.MailService || mongoose.model('MailService', MailServiceSchema);
