SaaS Video & Image Sharing Platform
---
A modern SaaS platform for uploading, managing, and sharing videos and images securely. Built with Next.js (App Router), Prisma, PostgreSQL (Neon), and Cloudinary. Users can upload videos and images, control access, and transform media into social-ready formats.

🖥 Features
---
* User Authentication: Sign up, sign in, and secure access using Clerk.

* Video Uploads: Users can upload videos that are only visible to them.

* Video Compression: Automatically compress videos before storing to save space and improve load times.

* Image Uploads & Downloads: Users can upload images and download them safely; temporary anchor links are deleted after download.

* Image Conversion: Convert images into multiple formats and aspect ratios for platforms like Instagram (square/post), Stories, etc.

* Cloud Storage: Media files stored in Cloudinary for fast delivery.

* Modern UI: Clean interface with TailwindCSS and shadcn/ui components.

* Secure API: Routes secured per-user using server-side authentication.

🚀 Tech Stack
---
Frontend: Next.js (App Router), React, TailwindCSS

Backend: Next.js API Routes, Prisma ORM

Database: PostgreSQL (Neon)

Authentication: Clerk

Cloud Storage & Media Processing: Cloudinary (supports compression, resizing, and format conversions)


⚡ Getting Started
---
1. Clone the repo
git clone <https://github.com/kajalsanwalll/saas-project>

    cd saas-project

2. Install dependencies using
npm install

3. Configure environment variables

 Create a .env file with:

* DATABASE_URL="postgresql://<user>:<password>@<host>/<db>?sslmode=require&channel_binding=require"

* CLOUDINARY_CLOUD_NAME=<your-cloud-name>

* CLOUDINARY_API_KEY=<your-api-key>

* CLOUDINARY_API_SECRET=<your-api-secret>

* NEXT_PUBLIC_CLERK_FRONTEND_API=<your-clerk-frontend-api>

* CLERK_API_KEY=<your-clerk-api-key>

4. Run the project using
"npm run dev"


Open http://localhost:3000
 to view the app.

🔑 Usage
---

Go to /Home

Sign Up / Sign In to start using the platform.

Upload videos — only visible to the uploader; they are automatically compressed for faster load and smaller storage.

Upload images — download links are deleted automatically after download.

Convert images into social-ready formats (square, story, post).

Share content safely via your social-share page.

🛠 Future Improvements
---
Support more video formats and advanced compression options.

Add image filters, templates, and stickers for social posts.

Implement real-time collaboration for editing shared media.

Add analytics dashboard for user activity.

📄 License
---
MIT License © 2026 Kajal Sanwal