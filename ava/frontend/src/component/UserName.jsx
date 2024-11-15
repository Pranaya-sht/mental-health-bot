import { useUser } from '@clerk/clerk-react';

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
                <p> {user?.fullName}</p>
            ) : (
                <p></p>
            )}
        </div>
    );
}

export default Name;
