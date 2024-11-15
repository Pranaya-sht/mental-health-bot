import requests

# Clerk API Key
CLERK_API_KEY = "sk_test_0pvdR1t6XJi6C2PawY5uGFrowkJ9lnv2qNDCKv21B4"

# Base URL for Clerk API
BASE_URL = "https://api.clerk.com/v1/users"

# Fetch users
def fetch_users():
    headers = {
        "Authorization": f"Bearer {CLERK_API_KEY}",
        "Content-Type": "application/json",
    }

    response = requests.get(BASE_URL, headers=headers)

    if response.status_code == 200: #ok
        users = response.json()
        return users
    else:
        print(f"Error: {response.status_code}, {response.text}")
        return []

if __name__ == "__main__":
    users = fetch_users()
    print(users)
