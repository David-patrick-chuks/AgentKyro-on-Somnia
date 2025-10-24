import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure multer for Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'agentkyro',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'pdf'],
    transformation: [{ width: 1000, height: 1000, crop: 'limit' }]
  } as any
});

export const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Check file type
    if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only images and PDF files are allowed!'));
    }
  }
});

// Cloudinary utility functions
export const uploadToCloudinary = async (file: Express.Multer.File): Promise<string> => {
  try {
    const result = await cloudinary.uploader.upload(file.path, {
      folder: 'agentkyro',
      resource_type: 'auto'
    });
    return result.secure_url;
  } catch (error) {
    throw new Error(`Cloudinary upload failed: ${error}`);
  }
};

export const deleteFromCloudinary = async (publicId: string): Promise<void> => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    throw new Error(`Cloudinary delete failed: ${error}`);
  }
};

export const generateQRCode = async (data: string): Promise<string> => {
  try {
    const result = await cloudinary.uploader.upload(`data:image/svg+xml;base64,${Buffer.from(data).toString('base64')}`, {
      folder: 'agentkyro/qrcodes',
      resource_type: 'image'
    });
    return result.secure_url;
  } catch (error) {
    throw new Error(`QR Code generation failed: ${error}`);
  }
};

export default cloudinary;
