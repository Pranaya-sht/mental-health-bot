import random

def load_quotes_from_file(filename):
    """Load quotes from a file and return them as a list."""
    with open(filename, "r", encoding="utf-8") as file:
        quotes = file.readlines()
    return quotes

def get_random_quote(quotes):
    """Returns a randomly selected quote from the list of quotes."""
    return random.choice(quotes).strip()

def chatbot():
    quotes = load_quotes_from_file("mental_health_quotes.txt")  # Load quotes from the file
    print("Chatbot: Hello! I'm here to support you. If you need a mental health quote, just ask.")
    
    while True:
        user_input = input("You: ").strip().lower()

        if "quote" in user_input:
            # Provide a random quote
            print("Chatbot: Here's a quote for you:")
            print(f"\"{get_random_quote(quotes)}\"")
        elif user_input == "hello":
            print("Chatbot: Hello! How can I assist you today?")
        elif user_input in ["exit", "quit"]:
            # Exit the chatbot
            print("Chatbot: Take care! Remember, your mental well-being matters.")
            break
        else:
            # Handle invalid input
            print("Chatbot: Sorry, I didn't understand that. Please type 'quote' for a mental health quote, 'hello' to greet me, or 'exit' to leave.")

# Run the chatbot
if __name__ == "__main__":
    chatbot()
