import { createImageUpload } from "novel";
import { toast } from "sonner";
import type { SupabaseClient } from '@supabase/supabase-js';
import { uploadFile, getPublicUrl } from '@/services/storageService';

const validateFn = (file: File) => {
  if (!file.type.includes("image/")) {
    toast.error("File type not supported.");
    return false;
  }
  if (file.size / 1024 / 1024 > 20) {
    toast.error("File size too big (max 20MB).");
    return false;
  }
  return true;
};

export const createOnUpload = (supabase: SupabaseClient, userId: string, bucketName: string) => {
  return async (file: File): Promise<string> => {
    const fileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
    const storageFilePath = `${userId}/${fileName}`;

    // eslint-disable-next-line no-async-promise-executor
    const promise = new Promise<string>(async (resolve, reject) => {
      try {
        const uploadedPath = await uploadFile(supabase, bucketName, storageFilePath, file);
        if (!uploadedPath) {
          throw new Error("Upload failed, no path returned.");
        }
        const publicUrl = getPublicUrl(supabase, bucketName, uploadedPath);
        
        const image = new Image();
        image.src = publicUrl;
        image.onload = () => {
          resolve(publicUrl);
        };
        image.onerror = () => {
          console.warn("Failed to preload image, but proceeding with URL:", publicUrl);
          resolve(publicUrl);
        };

      } catch (error: unknown) {
        console.error("Error during image upload:", error);
        reject(error);
      }
    });

    toast.promise(promise, {
      loading: "Uploading image...",
      success: "Image uploaded successfully.",
      error: (e) => {
        return e.message || "Error uploading image. Please try again.";
      },
    });

    return promise;
  };
};

export const createUploadFn = (supabase: SupabaseClient, userId: string, bucketName: string) => {
  return createImageUpload({
    onUpload: createOnUpload(supabase, userId, bucketName),
    validateFn,
  });
};