import { useUser } from '@clerk/clerk-react';
import { Link } from "react-router-dom";

function Name() {
    const { isSignedIn, user, isLoaded } = useUser();

    // Check if user data is loaded and user is signed in
    if (isLoaded && isSignedIn) {
        // Access the user's name
        const firstName = user?.firstName || '';
        const lastName = user?.lastName || '';
        const fullName = `${firstName} ${lastName}`.trim();

        console.log("User's Full Name:", fullName);
    }

    return (
        <div>
            {isSignedIn ? (
                <p>
                    <Link
                        to="/profile"
                        className="relative group w-fit cursor-pointer"
                    >
                        {/* Display User's Name */}
                        <span className="block group-hover:text-lime-50 transition-opacity duration-150">
                            {user?.fullName}
                        </span>
                        {/* Typing Effect for "Go to Profile" */}
                        <span className="absolute top-0 left-0 w-full overflow-hidden whitespace-nowrap text-transparent group-hover:text-gray-400 transition-all duration-[2s] ease-linear">

                        </span>
                    </Link>


                </p>
            ) : (
                <p></p>
            )}
        </div>
    );
}

export default Name;
