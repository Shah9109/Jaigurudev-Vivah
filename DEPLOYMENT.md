# Deployment Guide for Vercel and Render

This project is organized as a monorepo with separate `frontend` and `backend` applications.

- **Frontend**: Best deployed on **Vercel**.
- **Backend**: Best deployed on **Render** (since Vercel has timeouts for serverless functions, and a dedicated backend service is often better).

## Prerequisites

1.  **GitHub Account**: Ensure your project is pushed to GitHub.
2.  **Vercel Account**: For frontend ([vercel.com](https://vercel.com)).
3.  **Render Account**: For backend ([render.com](https://render.com)).
4.  **Cloud Database**: A cloud-hosted MongoDB like [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
5.  **Cloudinary Account**: For image uploads.

---

## Part 1: Deploy Backend to Render

1.  Log in to your **Render Dashboard**.
2.  Click **"New +"** -> **"Web Service"**.
3.  Connect your GitHub repository (`Shah9109/Jaigurudev-Vivah`).
4.  **Configure the Service**:
    *   **Name**: `jaigurudev-vivah-backend`
    *   **Root Directory**: `backend` (Important!)
    *   **Runtime**: Node
    *   **Build Command**: `npm install && npm run build` (Crucial: The default is just npm install, which is wrong for Next.js)
    *   **Start Command**: `npm start`
5.  **Environment Variables**: Add these key-value pairs:
    *   `MONGODB_URI`: Your MongoDB Atlas connection string.
    *   `JWT_SECRET`: A strong secret key.
    *   `CLOUDINARY_CLOUD_NAME`: Your Cloudinary cloud name.
    *   `CLOUDINARY_API_KEY`: Your Cloudinary API key.
    *   `CLOUDINARY_API_SECRET`: Your Cloudinary API secret.
    *   `NODE_VERSION`: `20` (Recommended)
6.  Click **Create Web Service**.
7.  Wait for deployment to finish. Copy the **Service URL** (e.g., `https://jaigurudev-vivah-backend.onrender.com`).

---

## Part 2: Deploy Frontend to Vercel

1.  Log in to your **Vercel Dashboard**.
2.  Click **"Add New..."** -> **"Project"**.
3.  Import the same GitHub repository.
4.  **Configure the Project**:
    *   **Project Name**: `jaigurudev-vivah-frontend`
    *   **Framework Preset**: Next.js
    *   **Root Directory**: Click "Edit" and select `frontend`.
5.  **Environment Variables**:
    *   `NEXT_PUBLIC_API_URL`: The URL of your deployed backend from Part 1 (e.g., `https://jaigurudev-vivah-backend.onrender.com`).
    *   `CLOUDINARY_CLOUD_NAME`: Same as backend.
    *   `CLOUDINARY_API_KEY`: Same as backend.
    *   `CLOUDINARY_API_SECRET`: Same as backend.
6.  Click **Deploy**.

---

## Troubleshooting

### Render "ENOENT: no such file or directory, open .../.next/BUILD_ID"
This means you forgot to run the build script.
*   **Fix**: Go to Render Dashboard -> Settings -> Build & Deploy.
*   Change **Build Command** to: `npm install && npm run build`

### Render Port Issues
Render automatically assigns a port (usually 10000) and sets the `PORT` environment variable.
*   Ensure your `start` script is `next start` (without -p 3001). We have updated `package.json` to fix this.


