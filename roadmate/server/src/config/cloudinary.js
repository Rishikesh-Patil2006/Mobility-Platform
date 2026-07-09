// Placeholder for Cloudinary setup
const cloudinary = require('cloudinary').v2;
const config = require('./env');

/*
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});
*/

const uploadImageToCloudinary = async (file) => {
  // Placeholder implementation
  return { url: 'https://placeholder.com/image.jpg', publicId: 'placeholder_id' };
};

const uploadDocumentToCloudinary = async (file) => {
  // Placeholder implementation
  return { url: 'https://placeholder.com/doc.pdf', publicId: 'placeholder_doc_id' };
};

module.exports = {
  uploadImageToCloudinary,
  uploadDocumentToCloudinary
};
