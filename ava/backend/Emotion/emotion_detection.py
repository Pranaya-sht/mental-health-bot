import json
from transformers import pipeline

# Load the emotion analysis pipeline
emotion_analyzer = pipeline("text-classification", model="j-hartmann/emotion-english-distilroberta-base", return_all_scores=True)

# File paths
graph_data_file = "emotion_graph_data.json"

# Function to analyze emotion
def analyze_emotion(text):
    results = emotion_analyzer(text)
    emotions = {res['label']: res['score'] for res in results[0]}
    dominant_emotion = max(emotions, key=emotions.get)
    return dominant_emotion, emotions[dominant_emotion]

# Function to save emotions for graph generation
def save_emotion_for_graph(emotion, score):
    try:
        # Read existing data
        with open(graph_data_file, "r") as f:
            existing_data = json.load(f)
    except FileNotFoundError:
        existing_data = []

    # Append new emotion data for graphing
    existing_data.append({"emotion": emotion, "score": score})

    # Write back to the file
    with open(graph_data_file, "w") as f:
        json.dump(existing_data, f, indent=4)

# Function to get suggestions based on detected emotion
def get_suggestions(emotion):
    suggestions = {
        "joy": "It's great to hear that you're feeling happy! Keep spreading that positivity. If you feel like sharing, tell me what's making you so joyful.",
        "sadness": "I'm sorry you're feeling down. It's okay to feel sad sometimes. You might try reaching out to a friend or even journaling your thoughts. Would you like to talk about it?",
        "fear": "It sounds like you're feeling anxious. It's normal to feel scared, especially when facing something new. Deep breathing exercises or speaking to someone can help calm your nerves. Do you want some tips on how to relax?",
        "anger": "I can sense some frustration. It's important to express your anger in healthy ways. Try taking a break, listening to music, or talking to someone about it. Would you like to talk about what’s bothering you?",
        "disgust": "It seems like something is really bothering you. If you need to vent or share what’s on your mind, I’m here to listen. Sometimes talking things out can help.",
        "surprise": "It sounds like something took you by surprise! Surprises can be both exciting and overwhelming. Want to share more about what happened?"
    }
    return suggestions.get(emotion, "I'm here to listen. Feel free to talk about what's on your mind!")

# Main function for chatbot interaction
def main():
    print("Welcome to ManobalAI! I can help you with your emotions. Let's start.")
    while True:
        text = input("Enter text to analyze emotion (or 'exit' to quit): ")
        if text.lower() == 'exit':
            break
        
        emotion, score = analyze_emotion(text)
        print(f"Emotion: {emotion}, Score: {score:.4f}")
        
        # Save emotion data for graph generation
        save_emotion_for_graph(emotion, score)
        
        # Get and display suggestions based on emotion
        suggestion = get_suggestions(emotion)
        print(f"Suggestion: {suggestion}")
        print()

if __name__ == "__main__":
    main()
