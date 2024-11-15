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




const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
    throw new Error("Missing Publishable Key")
}





const router = createBrowserRouter([
    {
        path: "/",
        element: <header>
            <SignInPage></SignInPage>

            <SignedIn>
                <div className=" absolute  right-5 h-10 flex py-12 mr-10">
                    <UserButton
                        appearance={{
                            elements: {
                                // Customizes the user avatar
                                userButtonAvatarBox: "w-12 h-12 rounded-50", // Makes the avatar square and sets size
                            },
                        }}
                    />

                </div>

                <App />
            </SignedIn>
        </header>,
    },

]);



ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
            <RouterProvider router={router} />
        </ClerkProvider>

    </React.StrictMode>,
);