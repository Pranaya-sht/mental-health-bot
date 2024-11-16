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
        console.log("userin: ", userInput);
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
            <div className="p-6 bg-gray-800 text-gray-200 min-h-screen flex flex-col items-center">
                {/* Back Button */}
                <button
                    onClick={() => window.history.back()}
                    className="self-start mb-4 px-4 py-2 bg-red-600 text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-red-400 focus:ring-2 focus:ring-red-500"
                >
                    Back
                </button>

                {/* Analyze Emotion Button */}
                <button
                    onClick={handleSubmit}
                    className="px-6 py-3 bg-cyan-600 text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-cyan-400 focus:ring-2 focus:ring-cyan-500"
                >
                    Analyze Emotion
                </button>

                {/* Emotion Result */}
                {emotionResult && (
                    <div className="mt-6 bg-gray-700 p-4 rounded-lg shadow-md w-full max-w-md">
                        <h3 className="text-lg font-bold text-cyan-400">Detected Emotion</h3>
                        <p className="mt-2 text-lg">Emotion: <span className="font-semibold">{emotionResult.emotion}</span></p>
                        <p className="mt-1">Confidence Score: <span className="font-mono">{emotionResult.score.toFixed(4)}</span></p>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <p className="mt-4 text-red-500 font-semibold">
                        {error}
                    </p>
                )}

                {/* Generate Graph Button */}
                <button
                    onClick={generateGraph}
                    className="mt-6 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-indigo-400 focus:ring-2 focus:ring-indigo-500"
                >
                    Generate Emotion Graph
                </button>

                {/* Display Graph */}
                {graphUrl && (
                    <div className="mt-6 bg-gray-700 p-4 rounded-lg shadow-md w-full">
                        <h3 className="text-xl font-bold text-indigo-400">Emotion Graph</h3>
                        <div className="flex items-center justify-center">
                            <img
                                src={graphUrl}
                                alt="Emotion Graph"
                                className="mt-4 rounded-lg border-2 border-cyan-500"
                            />
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default Graph;
