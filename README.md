# PixelStock

PixelStock is a modern, responsive image-sharing platform built with the MERN stack (MongoDB, Express, React, Node.js) and TypeScript. It allows users to upload, manage, and share images, with features like customizable profiles, public/private image visibility, and a global explore gallery.

## 🚀 Features

### Frontend (React + Vite + TypeScript)
- **Modern UI/UX**: Built with Framer Motion for fluid animations and a custom design system.
- **Responsive Design**: Fully responsive components that work seamlessly on across mobile, tablet, and desktop devices.
- **User Authentication**: Sign up, sign in, email verification, and password reset flows.
- **Image Dashboard**: Drag-and-drop uploads, masonry grid layouts, image reordering, and privacy toggling (Public/Private).
- **Profile Management**: Customizable user avatars, bios, and social links.
- **Explore Gallery**: A public gallery to discover images shared by other users, featuring a masonry layout and a custom lightbox viewer.
- **Robust State & API Management**: Uses Axios with interceptors for token management and React Hook Form + Zod for validation.

### Backend (Node.js + Express + TypeScript)
- **RESTful API**: Clean and structured API architecture using Controller-Service-Repository patterns.
- **Authentication**: JWT-based authentication with access and refresh tokens. Role-based access control (User vs. Admin).
- **Cloud Storage**: Integrates with Cloudinary for secure and reliable image hosting and transformations.
- **MongoDB Database**: Efficient data modeling using Mongoose for Users and Images.
- **Email Services**: Integration with Nodemailer/SendGrid for verification emails and password reset links.
- **Security**: Password hashing (bcrypt), HTTP-only cookies, CORS configuration, and robust error handling.

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite, React Router DOM, Tailwind CSS (Custom compiled via palette), Framer Motion, React Hook Form, Zod, Sonner (Toasts).
- **Backend**: Node.js, Express, TypeScript, MongoDB, Mongoose, JWT, Cloudinary, Multer, Bcrypt, Nodemailer.

## 📦 Project Structure

The repository is structured as a monorepo containing both the frontend and backend applications.

```
pixelStock/
├── backend/                # Node.js/Express API
│   ├── src/
│   │   ├── config/         # Environment & DB configurations
│   │   ├── controllers/    # Route controllers
│   │   ├── di/             # Dependency Injection setup
│   │   ├── middlewares/    # Custom middlewares (Auth, Error handling)
│   │   ├── models/         # Mongoose schemas
│   │   ├── repositories/   # Database access layer
│   │   ├── routers/        # Express routes
│   │   ├── services/       # Business logic
│   │   └── utils/          # Helper functions (Cloudinary, Multer, Emails)
│   └── package.json
│
└── frontend/               # React + Vite App
    ├── src/
    │   ├── assets/         # Static assets
    │   ├── components/     # Reusable UI components (dashboard, explore, profile, ui)
    │   ├── config/         # App configurations (e.g., Toast settings)
    │   ├── guards/         # Route guards (Auth protection)
    │   ├── lib/            # Utilities & Validations (Zod schemas)
    │   ├── pages/          # Next.js-style page components
    │   ├── routers/        # React Router configuration
    │   └── services/       # API integration services (Axios instances)
    └── package.json
```

## ⚙️ Local Development Setup

### Prerequisite Requirements
- Node.js (v18+)
- MongoDB (Local or Atlas Atlas URI)
- Cloudinary Account (for image uploads)

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd pixelStock
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:
```env
PORT=5000
MONGODB_URL=your_mongodb_connection_string
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
FRONTEND_URL=http://localhost:5173
```

Start the backend development server:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

Create a `.env` file in the `frontend` directory:
```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend development server:
```bash
npm run dev
```

## 📝 Scripts

**Backend:**
- `npm run dev`: Starts the server in watch mode using `ts-node-dev`.
- `npm run build`: Compiles TypeScript to JavaScript in the `dist/` directory.
- `npm start`: Runs the compiled JavaScript file.

**Frontend:**
- `npm run dev`: Starts the Vite development server.
- `npm run build`: Builds the app for production.
- `npm run preview`: Locally previews the production build.

## 📄 License
This project is proprietary and confidential.
