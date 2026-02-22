import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});

export const uploadImage = async (fileUri: string, folder: string = 'cosmetic-sales-on') => {
    try {
        const result = await cloudinary.uploader.upload(fileUri, {
            folder: folder,
        });
        return {
            url: result.secure_url,
            publicId: result.public_id,
        };
    } catch (error) {
        console.error('Cloudinary Upload Error:', error);
        throw error;
    }
};

export const deleteImage = async (publicId: string) => {
    try {
        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        console.error('Cloudinary Delete Error:', error);
        throw error;
    }
};

export default cloudinary;
