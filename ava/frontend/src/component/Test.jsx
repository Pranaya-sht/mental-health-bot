import React, { useState, useEffect } from "react";
import axios from "axios";

const App = () => {
    const [quote, setQuote] = useState(""); // State to hold the fetched quote

    // Function to fetch a random quote from the API
    const fetchQuote = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:8000/random-quote"); // Replace with your actual API URL
            setQuote(response.data.quote); // Update state with the fetched quote
        } catch (error) {
            console.error("Error fetching quote:", error);
            setQuote("Sorry, we couldn't fetch a quote. Please try again later."); // Fallback quote
        }
    };

    // Fetch a new quote on component mount
    useEffect(() => {
        fetchQuote();
    }, []);

    return (
        <div className="flex border-2  justify-between rounded-md p-3 border-cyan-400 ml-8" >

            <p className=" text-sm   text-cyan-700">{quote}</p>
            {/* <button style={styles.button} onClick={fetchQuote}>
                Generate New Quote
            </button> */}
        </div>
    );
};




export default App;
