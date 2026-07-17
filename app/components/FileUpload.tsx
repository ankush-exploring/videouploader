"use client"; // This component must be a client component

import {
  ImageKitAbortError,
  ImageKitInvalidRequestError,
  ImageKitServerError,
  ImageKitUploadNetworkError,
  upload,
  UploadResponse,
} from "@imagekit/next";
import { useState } from "react";

interface FileUploadProps {
  onSuccess: (res: UploadResponse) => void;
  onProgress?: (progress: number) => void;
  onError?: (message: string) => void;
  fileType?: "image" | "video";
}

const FileUpload = ({ onSuccess, onProgress, onError, fileType }: FileUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  //optional validation

  const validateFile = (file: File) => {
    if (fileType === "video") {
      if (!file.type.startsWith("video/")) {
        setError("Please upload a valid video file");
      }
    }
    if (file.size > 100 * 1024 * 1024) {
      setError("File size must be less than 100 MB");
    }
    return true;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file || !validateFile(file)) return;

    setUploading(true);
    setError(null);

    try {
      const authRes = await fetch("/api/auth/imagekit-auth");
      const auth = await authRes.json();

      const res = await upload({
        file,
        fileName: file.name,
        publicKey: auth.publicKey,
        signature: auth.authenticationParameters.signature,
        expire: auth.authenticationParameters.expire,
        token: auth.authenticationParameters.token,
        onProgress: (event) => {
          if(event.lengthComputable && onProgress){
            const percent = (event.loaded / event.total) * 100;
            onProgress(Math.round(percent))
          }
        },
        
      });
      onSuccess(res)
    } catch (error) {
        const message =
          error instanceof ImageKitInvalidRequestError
            ? "Invalid upload request. Check your ImageKit keys."
            : error instanceof ImageKitServerError
            ? "ImageKit server error. Please try again."
            : error instanceof ImageKitUploadNetworkError
            ? "Network error during upload."
            : error instanceof ImageKitAbortError
            ? "Upload was cancelled."
            : error instanceof Error
            ? error.message
            : "Upload failed. Please try again.";
        console.error("Upload failed:", message, error)
        setError(message);
        onError?.(message);
    } finally {
        setUploading(false)
    }
  };

  return (
    <>
      <input
        type="file"
        accept={fileType === "video" ? "video/*" : "image/*"}
        onChange={handleFileChange}
      />
      {uploading && <span>Loading....</span>}
      {error && <span className="text-error text-sm">{error}</span>}
    </>
  );
};

export default FileUpload;
