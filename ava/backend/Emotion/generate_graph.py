import json
import matplotlib.pyplot as plt

# File path for emotion data
graph_data_file = "emotion_graph_data.json"

# Function to generate a graph based on saved emotions
def generate_graph():
    try:
        # Load emotion data
        with open(graph_data_file, "r") as f:
            emotion_data = json.load(f)

        # Count the occurrences of each emotion
        emotion_counts = {}
        for entry in emotion_data:
            emotion = entry['emotion']
            if emotion not in emotion_counts:
                emotion_counts[emotion] = 0
            emotion_counts[emotion] += 1

        # Prepare data for plotting
        emotions = list(emotion_counts.keys())
        counts = list(emotion_counts.values())

        # Plotting the graph
        plt.figure(figsize=(10, 6))
        plt.bar(emotions, counts, color='skyblue')
        plt.xlabel("Emotions")
        plt.ylabel("Frequency")
        plt.title("Emotion Frequency from User Interactions")
        plt.xticks(rotation=45)
        plt.tight_layout()

        # Save the graph as an image
        graph_path = "emotion_graph.png"
        plt.savefig(graph_path)
        print(f"Graph generated successfully! Saved to {graph_path}.")
    except FileNotFoundError:
        print("No emotion data found to generate a graph.")

# Run the function for standalone testing
if __name__ == "__main__":
    generate_graph()
