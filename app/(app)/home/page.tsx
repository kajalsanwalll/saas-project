"use client";
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import VideoCard from "@/components/VideoCard";
import { Video } from "@/types";
import Link from "next/link";
import { useTheme } from "next-themes";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UploadCloud, Video as VideoIcon, ShieldCheck, Moon, Sun } from "lucide-react";

export default function HomePage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Video state
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Theme mounted check
  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch videos
  const fetchVideos = useCallback(async () => {
    try {
      const response = await axios.get("/api/videos");
      if (Array.isArray(response.data)) {
        setVideos(response.data);
      } else {
        throw new Error("Unexpected response format");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch videos");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  // Download handler
  const handleDownload = useCallback((url: string, title: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${title}.mp4`);
    link.setAttribute("target", "_blank");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-zinc-100 to-zinc-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 px-6 py-10">
      {/* 🌗 Theme Toggle */}
      <div className="flex justify-end max-w-5xl mx-auto mb-8">
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          {theme === "dark" ? "Light" : "Dark"}
        </Button>
      </div>

      {/* Hero */}
      <section className="mx-auto max-w-5xl text-center mt-0">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Upload, Optimize & Share Videos
        </h1>

        <p className="mt-4 text-muted-foreground text-lg">
          A secure SaaS platform to upload videos, process them in the cloud,
          and access them anywhere.
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <Link href="/video-upload">
            <Button size="lg">Upload Video</Button>
          </Link>
          <Link href="/social-share">
            <Button size="lg" variant="outline">
              Social Share
            </Button>
          </Link>
        </div>
      </section>

      {/* Video Listing */}
      <section className="mx-auto max-w-5xl mt-16">
        <h2 className="text-2xl font-bold mb-4 text-center">Videos</h2>

        {loading ? (
          <div className="text-center text-lg">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : videos.length === 0 ? (
          <div className="text-center text-lg text-gray-500">No videos available</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <VideoCard
                key={video.id}
                video={video}
                onDownload={handleDownload}
              />
            ))}
          </div>
        )}
      </section>

      {/* Features */}
      <section className="mx-auto mt-20 grid max-w-5xl gap-6 sm:grid-cols-3">
        <Card className="rounded-2xl shadow-sm hover:shadow-md transition">
          <CardContent className="p-6 text-center">
            <UploadCloud className="mx-auto mb-4 h-10 w-10" />
            <h3 className="font-semibold text-lg">Fast Uploads</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Upload large videos seamlessly using Cloudinary.
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm hover:shadow-md transition">
          <CardContent className="p-6 text-center">
            <VideoIcon className="mx-auto mb-4 h-10 w-10" />
            <h3 className="font-semibold text-lg">Video Management</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              View, organize, and manage all your uploaded videos.
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm hover:shadow-md transition">
          <CardContent className="p-6 text-center">
            <ShieldCheck className="mx-auto mb-4 h-10 w-10" />
            <h3 className="font-semibold text-lg">Secure by Default</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Authentication powered by Clerk.
            </p>
          </CardContent>
        </Card>
      </section>

    </div>
  );
}
