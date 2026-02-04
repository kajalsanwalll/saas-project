"use client"
import React, {useState} from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { NextResponse } from 'next/server';

function VideoUpload() {
  
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const router = useRouter();

  // max size of 70 mb

  const MAX_FILE_SIZE = 70*1024*1024

  const handleSubmit = async (e: React.FormEvent) => {
     e.preventDefault()

     if(!file) return;

     if(file.size > MAX_FILE_SIZE) {
    /* return NextResponse.json(
        {
          message:"File size too large!"
        },
        {
          status:401
        }
      )  */
      console.log("File size too large!",Error);
      
     }

     setIsUploading(true);

     const formData = new FormData();
     formData.append("file", file)
     formData.append("title", title)
     formData.append("description", description)
     formData.append("originalSize", file.size.toString());


     try {
       const response = await axios.post("/api/video-upload", formData)

       console.log("status:200");

       // NextResponse.json({status:200})
     } catch (error) {
      console.log(error);
      
     }finally{
      setIsUploading(false);
     }
  }



  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-2xl font-bold mb-4'>Upload Video</h1>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div>
          <label className='label'>
            <span className='label-text'>Title</span>
          </label>
          <input 
           type='text'
           value={title}
           onChange={(e) => setTitle(e.target.value)}
           className='input input-bordered w-full'
           required
          ></input>
        </div>

        <div>
          <label className='label'>
            <span className='label-text'>Description</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className='textarea textarea-bordered w-full'
          ></textarea>
        </div>
        <div>
          <label className='label'>
            <span className='label-text'>Video File</span>
          </label>
          <input
            type='file'
            accept='video/*'
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className='file-input file-input-bordered w-full'
            required
          ></input>
        </div>
        <button 
         type='submit'
         className='btn btn-primary'
         disabled={isUploading}
        > {isUploading ? "Uploading..." : "Upload Video"}
        </button>
      </form>
    </div>
  )
}

export default VideoUpload