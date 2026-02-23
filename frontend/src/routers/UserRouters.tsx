import { createBrowserRouter, type RouteObject } from "react-router-dom";
import SignUp from "../pages/user/auth/SignUp";
import SignIn from "../pages/user/auth/SignIn";
import Home from "../pages/Home";
import VerifyEmailPage from "../pages/user/auth/VerifyEmail";
import DashboardPage from "../pages/user/dashboard/Dashboard";
import { PublicRoute } from "../hoc/PublicRoute";
import { ProtectedRoute } from "../hoc/ProtectedRoute";
import ForgotPasswordPage from "../pages/user/auth/ForgotPassword";
import ResetPasswordPage from "../pages/user/auth/ResetPassword";

export const UserRoutes: RouteObject[] = [
  {
    path: "",
    element: <Home />,
  },
  {
    path: "/auth",
    element: <PublicRoute />,
    children: [
      {
        path: "sign-up",
        element: <SignUp />,
      },
      {
        path: "sign-in",
        element: <SignIn />,
      },
      {
        path: "verify-email",
        element: <VerifyEmailPage />,
      },
      {
        path: "forgot-password",
        element: <ForgotPasswordPage />,
      },
      {
        path: "reset-password",
        element: <ResetPasswordPage />,
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
        { path: "dashboard", element: <DashboardPage /> }
    ],
  },
  { path: "*", element: <Home /> },
];

export const router = createBrowserRouter(UserRoutes);
