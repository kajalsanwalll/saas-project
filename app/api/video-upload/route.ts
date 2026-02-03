export const runtime = "nodejs";
import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { auth } from '@clerk/nextjs/server';
import { error } from 'console';
import { prisma } from "@/app/lib/prisma";

// Configuration
cloudinary.config({ 
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET /// Click 'View API Keys' above to copy your API secret
});

interface CloudinaryUploadResult {
    public_id: string;
    bytes:number;
    duration?: number;  // duration is optional
    [key: string] :any 

}

export async function POST(request: NextRequest){

    //authenticating the user
    const {userId} = await auth()

    if(!userId){
        return NextResponse.json(
            {
                error: "Unauthorized!"
            },
            {
                status:401
            }

        )
    }

    try {

        if(
        !process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
        !process.env.CLOUDINARY_API_KEY ||
        !process.env.CLOUDINARY_API_SECRET
        ){
        return NextResponse.json(
            {
                error: "Cloudinary credentials not found!"
            },
            {
                status: 500
            }
        )
        }

        //get the uploaded file
        const formData = await request.formData();
        const file = formData.get("file") as File | null;
        const title = formData.get("title") as string;
        const description = formData.get("description") as string;
        const originalSize = formData.get("originalSize") as string;


        if(!file){
            return NextResponse.json(
                {
                    error:"File not found!"
                },
                {
                    status: 400
                }
            )
        }
        
        //convert file to buffer
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)
        

        //upload the cloudinary
        const result = await new Promise<CloudinaryUploadResult>(
            (resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        resource_type: "video", 
                        folder: "video-uploads",
                        transformation: [{
                            quality: "auto" , fetch_format : "mp4"
                        }]
                    },
                    (error,result) => {
                        if(error) reject(error);
                        else resolve(result as CloudinaryUploadResult);
                    }
                )

                uploadStream.end(buffer)
            }
        )

        const video = await prisma.video.create({
            data: {
                title,
                description,
                publicId: result.public_id,
                originalSize: originalSize,
                compressedSize: String(result.bytes),
                duration: result.duration || 0
            }
        })

        return NextResponse.json(video)

    } catch (error) {
        console.log("Upload video failed!", error);
        return NextResponse.json(
            {
                error:"Upload video failed!"
            },
            {
                status: 500
            }
        )
        
    }finally{
        await prisma.$disconnect()
    }
}