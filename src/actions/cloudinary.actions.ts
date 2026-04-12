"use server";
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

export async function uploadImageAction(formData: FormData) {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET
    });

    const file = formData.get('file') as File;
    if (!file) throw new Error('No file provided');

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { 
          folder: "koz-forum",
          resource_type: "auto"
        }, 
        (error, result) => {
          if (error || !result) reject(error);
          else resolve(result);
        }
      ).end(buffer);
    });

    return {
      url: result.secure_url,
      public_id: result.public_id 
    };
  } catch (error: any) {
    console.error('Cloudinary Action Error:', error);
    return { error: error.message || 'Upload failed' };
  }
}