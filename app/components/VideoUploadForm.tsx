"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useNotification } from "./Notification";
import FileUpload from "./FileUpload";

interface UploadResponse {
  fileId: string;
  name: string;
  url: string;
  filePath: string;
}

export default function VideoUploadForm() {

  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const router = useRouter();
  const { showNotification } = useNotification();

  const onVideoUploadSuccess = (res: UploadResponse) => {
    setVideoUrl(res.filePath);
    setIsUploading(false);
    showNotification("Video uploaded successfully!", "success");
  };

  const onThumbnailUploadSuccess = (res: UploadResponse) => {
    setThumbnailUrl(res.filePath);
    setIsUploading(false);
    showNotification("Thumbnail uploaded successfully!", "success");
  };

  const onUploadError = (message: string) => {
    showNotification(message || "Upload failed. Please try again.", "error");
    setIsUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      showNotification("Please fill in title and description", "warning");
      return;
    }

    if (!videoUrl) {
      showNotification("Please upload a video", "warning");
      return;
    }

    if (!thumbnailUrl) {
      showNotification("Please upload a thumbnail", "warning");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/video", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          videoUrl,
          thumbnailUrl,
          controls: true,
          transformation: {
            height: 1920,
            width: 1080,
            quality: 100,
          },
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to save video");
      }

      showNotification("Video published successfully!", "success");
      router.push("/");
    } catch (error) {
      console.error("Submit error:", error);
      showNotification(
        error instanceof Error ? error.message : "Failed to publish video",
        "error"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title Input */}
      <div className="form-control w-full">
        <label className="label">
          <span className="label-text font-semibold">Video Title</span>
        </label>
        <input
          type="text"
          placeholder="Enter video title"
          className="input input-bordered w-full"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          disabled={isSubmitting}
        />
      </div>

      {/* Description Input */}
      <div className="form-control w-full">
        <label className="label">
          <span className="label-text font-semibold">Description</span>
        </label>
        <textarea
          placeholder="Enter video description"
          className="textarea textarea-bordered w-full"
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          disabled={isSubmitting}
        />
      </div>

      {/* Video Upload */}
      <div className="form-control w-full">
        <label className="label">
          <span className="label-text font-semibold">Upload Video</span>
        </label>
        <div className="border-2 border-dashed border-base-300 rounded-lg p-6 hover:border-primary transition-colors">
          <FileUpload
            fileType="video"
            onSuccess={onVideoUploadSuccess}
            onError={onUploadError}
          />
          {videoUrl && (
            <div className="mt-4 text-success">
              ✓ Video uploaded: {videoUrl}
            </div>
          )}
        </div>
      </div>

      {/* Thumbnail Upload */}
      <div className="form-control w-full">
        <label className="label">
          <span className="label-text font-semibold">Upload Thumbnail</span>
        </label>
        <div className="border-2 border-dashed border-base-300 rounded-lg p-6 hover:border-primary transition-colors">
          <FileUpload
            fileType="image"
            onSuccess={onThumbnailUploadSuccess}
            onError={onUploadError}
          />
          {thumbnailUrl && (
            <div className="mt-4 text-success">
              ✓ Thumbnail uploaded: {thumbnailUrl}
            </div>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <div className="form-control w-full pt-4">
        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={isSubmitting || isUploading}
        >
          {isSubmitting ? (
            <>
              <span className="loading loading-spinner loading-sm"></span>
              Publishing...
            </>
          ) : (
            "Publish Video"
          )}
        </button>
      </div>
    </form>
  );
}
