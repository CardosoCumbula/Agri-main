import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../firebase';

/**
 * Upload an image file to Firebase Storage
 * @param file - The file to upload
 * @param path - The storage path (e.g., 'products/product-id', 'listings/listing-id')
 * @returns The download URL of the uploaded file
 */
export async function uploadImage(file: File, path: string): Promise<string> {
  try {
    // Create a storage reference with a unique filename (using timestamp)
    const timestamp = new Date().getTime();
    const filename = `${timestamp}-${file.name}`;
    const storageRef = ref(storage, `${path}/${filename}`);

    // Upload the file
    const snapshot = await uploadBytes(storageRef, file);

    // Get the download URL
    const downloadUrl = await getDownloadURL(snapshot.ref);

    return downloadUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw new Error('Failed to upload image. Please try again.');
  }
}

/**
 * Delete an image from Firebase Storage
 * @param imageUrl - The download URL or storage path
 */
export async function deleteImage(imageUrl: string): Promise<void> {
  try {
    // Convert download URL to storage reference path
    // Firebase download URLs look like:
    // https://firebasestorage.googleapis.com/v0/b/{bucket}/o/{path}?alt=media&token={token}
    
    const storageRef = ref(storage, imageUrl);
    await deleteObject(storageRef);
  } catch (error) {
    console.error('Error deleting image:', error);
    // Don't throw - this might be a URL from another service
    // Just log and continue
  }
}

/**
 * Upload multiple images and return an array of download URLs
 * @param files - Array of files to upload
 * @param basePath - The base storage path (e.g., 'products')
 * @returns Array of download URLs
 */
export async function uploadMultipleImages(
  files: File[],
  basePath: string
): Promise<string[]> {
  try {
    const uploadPromises = files.map((file) => uploadImage(file, basePath));
    const urls = await Promise.all(uploadPromises);
    return urls;
  } catch (error) {
    console.error('Error uploading multiple images:', error);
    throw new Error('Failed to upload some images. Please try again.');
  }
}
