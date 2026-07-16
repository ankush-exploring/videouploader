"use client";

import VideoUploadForm from "../components/VideoUploadForm";
import Header from "../components/Header";
import { NotificationProvider } from "../components/Notification";

export default function VideoUploadPage() {
  return (
    <NotificationProvider>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Upload New Video</h1>
            <p className="text-base-content/70">
              Share your video with the community. Fill in the details and upload your video and thumbnail.
            </p>
          </div>
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <VideoUploadForm />
            </div>
          </div>
        </div>
      </div>
    </NotificationProvider>
  );
}
