import ReactDOM from 'react-dom/client';
import './main.css';
import App from './App';
import React from 'react';
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";

import { SignedIn, SignedOut, SignIn, SignInButton, UserButton } from "@clerk/clerk-react";
import { ClerkProvider } from '@clerk/clerk-react'
import SignInPage from './component/SignInPage';
import './App.css';
import { UserProfile } from "@clerk/clerk-react";
import ErrorPage from './component/ErrorPage';
import GraphPage from './component/GraphPage'
import Test from './component/Test'
import UserName from './component/UserName'





const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
    throw new Error("Missing Publishable Key")
}





const router = createBrowserRouter([
    {
        path: "/",
        errorElement: (
            <ErrorPage />
        ),

        element: (
            <header>
                <SignInPage />
                <SignedIn>
                    <div className="absolute   right-12 mt-5 flex flex-col ">
                        <UserButton
                            appearance={{
                                elements: {
                                    userButtonAvatarBox: "w-10 h-10 rounded-50 ml-9", // Customizes the avatar
                                },
                            }}
                        />
                        <h1 className="  text-sm mt-3  pr-7 text-gray-400 italic font-semibold   ">
                            <UserName />
                        </h1>
                    </div>
                    <App />
                </SignedIn>
            </header>
        ),
    },
    {
        path: "/profile", // New route for the profile page
        element: (
            <SignedIn>
                <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
                    <UserProfile
                        appearance={{
                            elements: {
                                // pageScrollBox: "bg-orange-950"
                            },

                        }}

                    />


                </div>
            </SignedIn>
        ),
    },
    {
        path: "/Graph",
        element: (
            <GraphPage />


        ),
    },


]);


ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
            <RouterProvider router={router} />
        </ClerkProvider>

    </React.StrictMode>,
);