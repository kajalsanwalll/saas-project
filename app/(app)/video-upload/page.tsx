"use client";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

function VideoUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const router = useRouter();

  const MAX_FILE_SIZE = 70 * 1024 * 1024; // 70 MB

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      console.log("File size too large!", Error);
    }

    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("originalSize", file.size.toString());

    try {
      const response = await axios.post("/api/video-upload", formData);
      console.log("status:200");
    } catch (error) {
      console.log(error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-black to-zinc-900 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-zinc-800 rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-center text-white mb-6">
          Upload Your Video
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text text-white font-semibold">
                Title
              </span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input  p-2 mt-2 input-bordered w-full bg-zinc-700 text-white border-zinc-600 focus:border-primary focus:ring focus:ring-primary/30"
              placeholder="Enter video title"
              required
            />
          </div>

          {/* Description */}
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text text-white font-semibold">
                Description
              </span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="textarea mt-2 p-2 textarea-bordered w-full bg-zinc-700 text-white border-zinc-600 focus:border-primary focus:ring focus:ring-primary/30"
              placeholder="Enter video description"
            ></textarea>
          </div>

          {/* Video File Upload */}
          <div className="form-control w-full">
            <label className="label">
              <span className=" label-text text-white font-semibold">
                Video File
              </span>
            </label>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="p-2 mt-2 file-input file-input-bordered w-full bg-zinc-700 text-white border-zinc-600"
              required
            />
            <p className=" text-sm text-zinc-400 mt-1">
              Max file size: 70 MB
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`btn w-full btn-primary ${
              isUploading ? "loading" : ""
            }`}
            disabled={isUploading}
          >
            {isUploading ? "Uploading...   Find your Compressed Video on Home!" : "Upload Video"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default VideoUpload;
