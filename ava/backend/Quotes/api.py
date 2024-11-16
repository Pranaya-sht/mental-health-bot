from fastapi import FastAPI
import random
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins (be cautious with this in production)
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers
)


# Function to load quotes from the file
def load_quotes_from_file(filename):
    """Load quotes from a file and return them as a list."""
    with open(filename, "r", encoding="utf-8") as file:
        quotes = file.readlines()
    return quotes

# Function to return a random quote
def get_random_quote(quotes):
    """Returns a randomly selected quote from the list."""
    return random.choice(quotes).strip()

# Define the endpoint to get a random quote
@app.get("/random-quote")
def random_quote():
    quotes = load_quotes_from_file("mental_health_quotes.txt")  # Load quotes from file
    quote = get_random_quote(quotes)  # Get a random quote
    return {"quote": quote}
