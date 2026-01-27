const cloudinary = require('cloudinary').v2;

if (!process.env.CLOUDINARY_URL) {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    });
}

const uploadToCloudinary = (fileBuffer, folder = "assignments", resourceType = "raw") => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: folder,
                resource_type: resourceType
            },
            (error, result) => {
                if (error) {
                    return reject(error);
                }
                resolve({
                    publicId: result.public_id,
                    url: result.url,
                    secureUrl: result.secure_url,
                    format: result.format,
                    resourceType: result.resource_type
                });
            }
        );
        uploadStream.end(fileBuffer);
    });
};

const deleteFromCloudinary = async (publicId, resourceType = "raw") => {
    try {
        await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
    } catch (error) {
        throw error;
    }
};

const getCloudinaryUrl = (publicId, resourceType = "raw") => {
    return cloudinary.url(publicId, {
        secure: true,
        resource_type: resourceType
    });
};

const getDownloadUrl = (publicId, format = "pdf", version = null, resourceType = "raw") => {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME || cloudinary.config().cloud_name;
    
    let url = `https://res.cloudinary.com/${cloudName}/${resourceType}/upload`;
    
    if (version) {
        url += `/v${version}`;
    }
    
    url += `/${publicId}`;
    
    return url;
};

module.exports = {
    uploadToCloudinary,
    deleteFromCloudinary,
    getCloudinaryUrl,
    getDownloadUrl
};
