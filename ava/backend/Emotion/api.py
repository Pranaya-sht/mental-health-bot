from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from pydantic import BaseModel
import json
import matplotlib.pyplot as plt
from transformers import pipeline
from fastapi.middleware.cors import CORSMiddleware

# Initialize FastAPI app
app = FastAPI()

origins = [
    "http://localhost:3000",  # React frontend URL
]

# Add CORS middleware to the FastAPI app
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Allows all origins in the list
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers
)



# Initialize the emotion analysis pipeline
emotion_analyzer = pipeline("text-classification", model="j-hartmann/emotion-english-distilroberta-base", return_all_scores=True)

# File paths
graph_data_file = "emotion_graph_data.json"

# Pydantic model for input data
class EmotionRequest(BaseModel):
    text: str

# Function to analyze emotion
def analyze_emotion(text):
    results = emotion_analyzer(text)
    emotions = {res['label']: res['score'] for res in results[0]}
    dominant_emotion = max(emotions, key=emotions.get)
    return dominant_emotion, emotions[dominant_emotion]

# Function to save emotions for graph generation
def save_emotion_for_graph(emotion, score):
    try:
        with open(graph_data_file, "r") as f:
            existing_data = json.load(f)
    except FileNotFoundError:
        existing_data = []

    existing_data.append({"emotion": emotion, "score": score})
    with open(graph_data_file, "w") as f:
        json.dump(existing_data, f, indent=4)

# Function to generate a graph
def generate_graph():
    try:
        with open(graph_data_file, "r") as f:
            emotion_data = json.load(f)

        emotion_counts = {}
        for entry in emotion_data:
            emotion = entry['emotion']
            if emotion not in emotion_counts:
                emotion_counts[emotion] = 0
            emotion_counts[emotion] += 1

        emotions = list(emotion_counts.keys())
        counts = list(emotion_counts.values())

        plt.figure(figsize=(10, 6))
        plt.bar(emotions, counts, color='skyblue')
        plt.xlabel("Emotions")
        plt.ylabel("Frequency")
        plt.title("Emotion Frequency from User Interactions")
        plt.xticks(rotation=45)
        plt.tight_layout()

        graph_path = "emotion_graph.png"
        plt.savefig(graph_path)
        return graph_path
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="No emotion data found to generate a graph.")

# API endpoints
@app.post("/analyze-emotion/")
def analyze_emotion_endpoint(request: EmotionRequest):
    emotion, score = analyze_emotion(request.text)
    save_emotion_for_graph(emotion, score)
    return {"emotion": emotion, "score": score}

@app.get("/generate-graph/")
def generate_graph_endpoint():
    graph_path = generate_graph()
    return FileResponse(graph_path, media_type="image/png")
