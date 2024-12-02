import mongoose from 'mongoose';

const KeyServiceSchema = new mongoose.Schema({
    platform: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PlatformMailService',
        required: true,
    },
    keys: [
        {
            name: { type: String, required: true },
            value: { type: String, required: true },
            expiry: { type: Date },
        },
    ],
});

// Check if a specific key is active
KeyServiceSchema.methods.isKeyActive = function (keyName) {
    const key = this.keys.find((key) => key.name === keyName);
    if (!key) return false;

    return key.expiry ? new Date() <= new Date(key.expiry) : true;
};

// Static method to get keys for a platform
KeyServiceSchema.statics.findByPlatform = async function (platformId) {
    return this.find({ platform: platformId });
};

// Get all active keys for a platform
KeyServiceSchema.statics.getActiveKeysByPlatform = async function (platformId) {
    const services = await this.find({ platform: platformId });
    const activeKeys = services.flatMap((service) =>
        service.keys.filter((key) => key.expiry ? new Date() <= new Date(key.expiry) : true)
    );

    return activeKeys;
};

// Create a compound index for platform and key names
KeyServiceSchema.index({ platform: 1, 'keys.name': 1 }, { unique: true });

export default mongoose.models.KeyService || mongoose.model('KeyService', KeyServiceSchema);
