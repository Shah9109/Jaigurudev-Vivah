# Jaigurudev Vivah

A full-stack matrimonial website for the Jaigurudev community.

## Tech Stack

- **Frontend:** Next.js (App Router), TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT (HttpOnly Cookie)

## Getting Started

1.  **Install Dependencies:**

    ```bash
    npm install
    ```

2.  **Environment Variables:**

    Rename `.env.local.example` to `.env.local` (or create it) and update the values:

    ```env
    MONGODB_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret_key
    ```

3.  **Run Development Server:**

    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser.

## Features

- **User Registration:** Join with strict "Marriage Only" agreement.
- **Profile Management:** Complete profile to unlock features.
- **Match Search:** Filter matches by gender.
- **Connection Requests:** Send/Accept/Reject requests.
- **Chat System:**
    - Only after mutual acceptance.
    - 7-day limit.
    - 20-message limit.
    - Status tracking.

## Deployment

- **Frontend & Backend:** Deploy to Vercel (recommended for Next.js).
- **Database:** MongoDB Atlas or Render Managed MongoDB.
