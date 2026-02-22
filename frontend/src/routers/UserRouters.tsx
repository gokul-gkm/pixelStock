import  { createBrowserRouter, type RouteObject } from "react-router-dom";
import SignUp from "../pages/user/auth/SignUp";
import SignIn from "../pages/user/auth/SignIn";
import Home from "../pages/Home";

export const UserRoutes: RouteObject[] = [
    {
        path: '',
        element: <Home/>
    },
    {
        path: '/auth',
        children: [
            {
                path: 'sign-up',
                element: <SignUp/>
            },
            {
                path: 'sign-in',
                element: <SignIn/>
            }
        ]
    }
]

export const router = createBrowserRouter(UserRoutes);