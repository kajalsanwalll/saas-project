"use client"; 
import React, { useRef, useEffect, useState } from "react";
import { CldImage } from "next-cloudinary";

const socialFormats = {
  "Instagram Square (1:1)": { width: 1080, height: 1080, aspectRatio: "1:1" },
  "Instagram Portrait (4:5)": { width: 1080, height: 1350, aspectRatio: "4:5" },
  "Twitter Post (16:9)": { width: 1200, height: 675, aspectRatio: "16:9" },
  "Twitter Header (3:1)": { width: 1500, height: 500, aspectRatio: "3:1" },
  "Facebook Cover (205:78)": { width: 820, height: 312, aspectRatio: "205:78" },
};

type SocialFormat = keyof typeof socialFormats;

export default function SocialShare() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<SocialFormat>(
    "Instagram Square (1:1)"
  );
  const [isUploading, setIsUploading] = useState(false);
  const [isTransforming, setIsTransforming] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (uploadedImage) {
      setIsTransforming(true);
    }
  }, [selectedFormat, uploadedImage]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/image-upload", {
        method: "POST",
        body: formData,
      });

      if (response.status === 401) {
        setIsUploading(false);
        window.location.href = "/sign-in";
        return;
      }

      if (!response.ok) throw new Error("Failed to upload image!");

      const data = await response.json();
      setUploadedImage(data.publicId);
    } catch (error) {
      console.error(error);
      alert("Failed to upload image!");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownload = () => {
    if (!imageRef.current) return;

    fetch(imageRef.current.src)
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${selectedFormat.replace(/\s+/g, "_").toLowerCase()}.png`;
        document.body.appendChild(link);
        link.click();

        // ✅ Safe removal
        if (link.parentNode) {
          link.parentNode.removeChild(link);
        }

        window.URL.revokeObjectURL(url);
      })
      .catch((err) => {
        console.error("Download failed:", err);
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-black to-zinc-900 flex items-center justify-center px-4">
      <div className="w-full max-w-2xl">
        <h1 className="text-4xl font-bold text-center mb-8 text-white">
          Social Media Image Creator
        </h1>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl shadow-xl p-6">
          <h2 className="text-xl font-semibold mb-4 text-white">Upload an Image</h2>

          {/* Upload box */}
          <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-zinc-700 rounded-xl cursor-pointer hover:border-primary transition">
            <span className="text-zinc-400 mb-2">Click to upload an image</span>
            <input type="file" className="hidden" onChange={handleFileUpload} />
          </label>

          {isUploading && (
            <div className="mt-4">
              <progress className="progress progress-primary w-full" />
            </div>
          )}

          {uploadedImage && (
            <div className="mt-8">
              <h2 className="text-lg font-semibold mb-3 text-white">Select Format</h2>

              <select
                className="select select-bordered w-full bg-zinc-800 text-white border-zinc-700"
                value={selectedFormat}
                onChange={(e) => setSelectedFormat(e.target.value as SocialFormat)}
              >
                {Object.keys(socialFormats).map((format) => (
                  <option key={format} value={format}>
                    {format}
                  </option>
                ))}
              </select>

              {/* Preview */}
              <div className="mt-8 relative">
                <h3 className="text-lg font-semibold mb-2 text-white">Preview</h3>

                <div className="relative flex justify-center rounded-xl overflow-hidden border border-zinc-800">
                  {isTransforming && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-10">
                      <span className="loading loading-spinner loading-lg" />
                    </div>
                  )}

                  <CldImage
                    width={socialFormats[selectedFormat].width}
                    height={socialFormats[selectedFormat].height}
                    src={uploadedImage}
                    alt="Preview"
                    crop="fill"
                    gravity="auto"
                    aspectRatio={socialFormats[selectedFormat].aspectRatio}
                    ref={imageRef}
                    onLoad={() => setIsTransforming(false)}
                    className="rounded-xl"
                  />
                </div>
              </div>

              {/* Download */}
              <div className="mt-6 flex justify-end">
                <button className="btn btn-primary px-6" onClick={handleDownload}>
                  Download
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
