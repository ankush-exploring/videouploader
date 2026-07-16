"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import Header from "./components/Header";
import VideoFeed from "./components/VideoFeed";
import { NotificationProvider } from "./components/Notification";
import { useEffect, useState } from "react";
import { IVideo } from "@/models/Video";

export default function Home() {
  const { data: session, status } = useSession();
  const [videos, setVideos] = useState<IVideo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch("/api/video");
        if (response.ok) {
          const data = await response.json();
          setVideos(data);
        }
      } catch (error) {
        console.error("Failed to fetch videos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  return (
    <NotificationProvider>
      <Header />
      <div className="min-h-screen bg-base-200">
        {status === "loading" ? (
          <div className="flex items-center justify-center min-h-screen">
            <div className="loading loading-spinner loading-lg"></div>
          </div>
        ) : !session ? (
          // Not authenticated - show landing page
          <div className="hero min-h-screen bg-gradient-to-r from-primary to-primary/80">
            <div className="hero-content text-center text-neutral-content">
              <div className="max-w-md">
                <h1 className="mb-5 text-5xl font-bold">
                  📹 Video with AI
                </h1>
                <p className="mb-5 text-lg">
                  Share your moments with advanced video hosting powered by ImageKit
                </p>
                <div className="flex gap-4 justify-center">
                  <Link
                    href="/login"
                    className="btn btn-secondary"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="btn btn-outline btn-secondary"
                  >
                    Create Account
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Authenticated - show video feed and upload button
          <div className="container mx-auto px-4 py-8">
            <div className="mb-8 flex justify-between items-center">
              <div>
                <h1 className="text-4xl font-bold mb-2">Video Feed</h1>
                <p className="text-base-content/70">
                  Discover videos from the community
                </p>
              </div>
              <Link
                href="/upload"
                className="btn btn-primary"
              >
                ➕ Upload Video
              </Link>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="loading loading-spinner loading-lg"></div>
              </div>
            ) : (
              <VideoFeed videos={videos} />
            )}
          </div>
        )}
      </div>
    </NotificationProvider>
  );
}
