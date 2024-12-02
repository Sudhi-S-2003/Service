import mongoose from 'mongoose';
import KeyService from './Key_Service';

const MailServiceSchema = new mongoose.Schema({
    platform: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PlatformMailService',
        required: true,
    },
    key: {
        keyRef: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'KeyService',
            required: true,
        },
        keyName: {
            type: String,
            required: true,
        },
    },
    codes: [
        {
            code: { type: String, required: true },
            value: { type: String, required: true },
        },
    ],
    isVerified: {
        type: Boolean,
        default: false,
    },
});

// Method to fetch full key details
MailServiceSchema.methods.getKeyDetails = async function () {
    const keyService = await KeyService.findOne({
        platform: this.platform,
        _id: this.key.keyRef,
    });
    if (!keyService) return null;

    return keyService.keys.find((key) => key.name === this.key.keyName) || null;
};

// Method to check if the key is expired or not
MailServiceSchema.methods.isKeyExpired = async function () {
    const keyDetails = await this.getKeyDetails();
    if (!keyDetails) return true;

    return keyDetails.expiry ? new Date() > new Date(keyDetails.expiry) : false;
};

// Optimized single method to get full details and expiry status
MailServiceSchema.methods.getKeyInfo = async function () {
    const keyDetails = await this.getKeyDetails();
    if (!keyDetails) {
        return { keyDetails: null, isExpired: true };
    }

    const isExpired = keyDetails.expiry ? new Date() > new Date(keyDetails.expiry) : false;
    return { keyDetails, isExpired };
};

// Static method to find all services for a platform
MailServiceSchema.statics.findByPlatform = async function (platformId) {
    return this.find({ platform: platformId }).populate('key.keyRef');
};

// Unique index to ensure a key is used only once per platform
MailServiceSchema.index({ platform: 1, 'key.keyName': 1 }, { unique: true });

export default mongoose.models.MailService || mongoose.model('MailService', MailServiceSchema);
