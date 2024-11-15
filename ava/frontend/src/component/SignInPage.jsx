import { SignedOut, SignIn } from '@clerk/clerk-react';
import React from 'react';
import { Typewriter } from 'react-simple-typewriter';

export default function SignInPage() {
    return (
        <SignedOut>
            <section className="bg-white">
                <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
                    <section className="relative flex h-32 items-end bg-gray-900 lg:col-span-5 lg:h-full xl:col-span-6">
                        <img
                            alt=""
                            src="https://images.unsplash.com/photo-1617195737496-bc30194e3a19?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
                            className="absolute inset-0 h-full w-full object-cover opacity-80"
                        />
                        <div className="hidden lg:relative lg:block lg:p-12">
                            <a className="block text-white" href="#">
                                <span className="sr-only">Home</span>
                                <svg
                                    className="h-8 sm:h-10"
                                    viewBox="0 0 28 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    {/* SVG Path */}
                                </svg>
                            </a>
                            <h2 className="mt-6 text-2xl font-bold text-white sm:text-3xl md:text-4xl">
                                <Typewriter
                                    words={['Welcome to ManobalAI 🧠💪']}
                                    loop={false}
                                    cursor
                                    cursorStyle="_"
                                    typeSpeed={50}
                                    deleteSpeed={50}
                                    delaySpeed={1000}
                                />
                            </h2>
                        </div>
                    </section>

                    <main className="flex items-center justify-center lg:col-span-7 xl:col-span-6">
                        <div className="max-w-xl lg:max-w-3xl">
                            <div className="relative -mt-16 block lg:hidden">
                                <a
                                    className="inline-flex size-16 items-center justify-center rounded-full bg-white text-blue-600 sm:size-20"
                                    href="#"
                                >
                                    <span className="sr-only">Home</span>
                                    <svg className="h-8 sm:h-10" viewBox="0 0 28 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        {/* SVG Path */}
                                    </svg>
                                </a>
                            </div>
                            <div className="flex justify-center">
                                <SignIn
                                    appearance={{
                                        elements: {
                                            formButtonPrimary: 'bg-slate-500 hover:bg-slate-400 text-sm',
                                            headerTitle: 'font-bold text-xl text-red-600',
                                            card: '',
                                            cardBox: 'w-full',
                                        },
                                    }}
                                />
                            </div>
                        </div>
                    </main>
                </div>
            </section>
        </SignedOut>
    );
}