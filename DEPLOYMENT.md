# Deployment Guide for Vercel

This project is organized as a monorepo with separate `frontend` and `backend` applications. Both are built using Next.js and can be easily deployed to Vercel.

## Prerequisites

1.  **GitHub Account**: Ensure your project is pushed to GitHub (which you have already done).
2.  **Vercel Account**: Sign up at [vercel.com](https://vercel.com) using your GitHub account.
3.  **Cloud Database**: Since Vercel is serverless, you cannot run a local MongoDB. You must use a cloud-hosted MongoDB like [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
4.  **Cloudinary Account**: For image uploads, you need a Cloudinary account.

---

## Step 1: Deploy the Backend

First, we need to deploy the backend so we can get its URL to configure the frontend.

1.  Log in to your Vercel Dashboard.
2.  Click **"Add New..."** -> **"Project"**.
3.  Import your GitHub repository (`Shah9109/Jaigurudev-Vivah`).
4.  **Configure the Project**:
    *   **Project Name**: `jaigurudev-vivah-backend` (or similar)
    *   **Framework Preset**: Next.js
    *   **Root Directory**: Click "Edit" and select `backend`. This is crucial!
5.  **Environment Variables**: Add the following variables (copy from your local `.env.local` but use production values):
    *   `MONGODB_URI`: Your MongoDB Atlas connection string.
    *   `JWT_SECRET`: A strong secret key.
    *   `CLOUDINARY_CLOUD_NAME`: Your Cloudinary cloud name.
    *   `CLOUDINARY_API_KEY`: Your Cloudinary API key.
    *   `CLOUDINARY_API_SECRET`: Your Cloudinary API secret.
6.  Click **Deploy**.
7.  Once deployed, copy the **Deployment URL** (e.g., `https://jaigurudev-vivah-backend.vercel.app`). You will need this for the frontend.

---

## Step 2: Deploy the Frontend

Now we deploy the frontend and connect it to the backend.

1.  Go back to your Vercel Dashboard.
2.  Click **"Add New..."** -> **"Project"**.
3.  Import the **same** GitHub repository again.
4.  **Configure the Project**:
    *   **Project Name**: `jaigurudev-vivah-frontend` (or similar)
    *   **Framework Preset**: Next.js
    *   **Root Directory**: Click "Edit" and select `frontend`.
5.  **Environment Variables**: Add the following:
    *   `NEXT_PUBLIC_API_URL`: The URL of your deployed backend (from Step 1). Do **not** include a trailing slash. Example: `https://jaigurudev-vivah-backend.vercel.app`
    *   `CLOUDINARY_CLOUD_NAME`: Same as backend.
    *   `CLOUDINARY_API_KEY`: Same as backend.
    *   `CLOUDINARY_API_SECRET`: Same as backend.
    *   `MONGODB_URI`: (Optional) Only if frontend connects directly to DB, but typically it goes through API. However, for `next-auth` or similar, it might be needed. Based on your code, frontend API routes proxy to backend, but some might need it. Safe to add.
6.  Click **Deploy**.

---

## Step 3: Verify Deployment

1.  Open your frontend deployment URL.
2.  Test the **Sign Up / Login** functionality to ensure database connection works.
3.  Test **Image Upload** to ensure Cloudinary works.
4.  Check the **Admin Dashboard** to verify admin features.

## Important Notes

*   **MongoDB Access**: Ensure your MongoDB Atlas "Network Access" whitelist includes `0.0.0.0/0` (allow access from anywhere) because Vercel's IP addresses are dynamic.
*   **Re-deployment**: Whenever you push changes to `main` on GitHub, Vercel will automatically redeploy both projects.

