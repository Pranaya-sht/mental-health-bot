import React, { useState } from "react";
import axios from "axios";
const Graph = ({ data }) => {
    const [userInput, setUserInput] = useState("");
    const [emotionResult, setEmotionResult] = useState(null);
    const [error, setError] = useState("");
    const [graphUrl, setGraphUrl] = useState("");

    // Handle input change
    const handleChange = () => {
        setUserInput(data);
    };

    // Handle form submission for emotion detection
    const handleSubmit = async (e) => {
        handleChange();
        e.preventDefault();
        setError("");
        setEmotionResult(null);

        console.log("userin: ", userInput)

        try {
            const response = await axios.post("http://127.0.0.1:8000/analyze-emotion", {
                text: userInput,
            });

            setEmotionResult(response.data);
            setUserInput(""); // Clear input field
        } catch (err) {
            setError("An error occurred while analyzing the emotion.");
            console.error(err);
        }
    };

    // Handle graph generation
    const generateGraph = async () => {
        setError("");
        setGraphUrl("");

        try {
            const response = await axios.get("http://127.0.0.1:8000/generate-graph", {
                responseType: "blob",
            });

            // Convert Blob to a URL for display
            const url = URL.createObjectURL(new Blob([response.data]));
            setGraphUrl(url);
        } catch (err) {
            setError("An error occurred while generating the graph.");
            console.error(err);
        }
    };

    return (
        <>
            <button onClick={handleSubmit}>
                Analyze Emotion
            </button>



            {emotionResult && (
                <div >
                    <h3>Detected Emotion: {emotionResult.emotion}</h3>
                    <p>Confidence Score: {emotionResult.score.toFixed(4)}</p>
                </div>
            )}

            {/* Error Message */}
            {error && <p >{error}</p>}

            {/* Generate Graph Button */}
            <button onClick={generateGraph}>
                Generate Emotion Graph
            </button>

            {/* Display Graph */}
            {graphUrl && (
                <div >
                    <h3>Emotion Graph</h3>
                    <img src={graphUrl} alt="Emotion Graph" />
                </div>
            )}

        </>
    );
};


export default Graph;
