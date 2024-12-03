//INTEGRATING API 

const POLLS_CONTAINER = document.getElementById("polls-container");
const ERROR_MESSAGE = document.getElementById("error-message");
const API_KEY = "6PMJYJ7EZ6M486KNBGAP812KCBJ0";
const API_BASE_URL = "https://api.pollsapi.com/v1";


// Function to create a poll
async function createPoll() {
    const API_URL_Create = "https://api.pollsapi.com/v1/create/poll"; // Use the correct endpoint here

    try {
        // Log the API Key and Endpoint for debugging
        console.log("API Key:", API_KEY);
        console.log("API Endpoint:", API_URL_Create);

        const response = await fetch(API_URL_Create, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "api-key": API_KEY, // Ensure this is defined
            },
            body: JSON.stringify({
                question: "What is better to donate?",
                options: [
                    { text: "Time" },
                    { text: "Resources" }
                ]
            })
        });

        // Log the raw response for debugging
        const responseText = await response.text();
        console.log("Raw API Response:", responseText);

        if (!response.ok) {
            console.error("Response not OK. Status:", response.status);
            console.error("Response Status Text:", response.statusText);
            throw new Error(`Error creating poll: ${responseText}`);
        }

        // Safely parse the response text
        let pollData;
        try {
            pollData = JSON.parse(responseText);
        } catch (parseError) {
            console.error("Error parsing JSON response:", parseError);
            throw new Error("Invalid JSON response from the API.");
        }

        console.log("Poll created successfully:", pollData);
        return pollData?.data?.id; // Return the poll ID or undefined if not present
    } catch (error) {
        console.error("Error in createPoll function:", error);
    }
}


// Function to fetch poll data
async function fetchPoll(pollId) {
    try {
        const response = await fetch(`${API_BASE_URL}/get/poll/${pollId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "api-key": API_KEY
            }
        });

        if (!response.ok) {
            const errorResponse = await response.json();
            throw new Error(`Error fetching poll: ${errorResponse.message}`);
        }

        const pollData = await response.json();
        return pollData.data;
    } catch (error) {
        console.error("Error fetching poll:", error);
    }
}

// Function to render the poll on the page
function displayPoll(poll) {
    const pollsContainer = document.getElementById("polls-container"); // This is correct

    pollsContainer.innerHTML = ""; // Clear previous content

    // Create poll question
    const questionElement = document.createElement("h2");
    questionElement.textContent = poll.question;
    pollsContainer.appendChild(questionElement);

    // Create options
    poll.options.forEach(option => {
        const optionButton = document.createElement("button");
        optionButton.textContent = option.text;
        optionButton.onclick = () => voteOnPoll(poll.id, option.id);
        pollsContainer.appendChild(optionButton);
    });
}

// Function to vote on a poll
async function voteOnPoll(pollId, optionId) {
    const API_VOTE_URL = "https://api.pollsapi.com/v1/create/vote"
    try {
        const response = await fetch(`${API_VOTE_URL}/create/vote`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "api-key": API_KEY
            },
            body: JSON.stringify({ option_id: optionId })
        });

        if (!response.ok) {
            const errorResponse = await response.json();
            throw new Error(`Error voting: ${errorResponse.message}`);
        }

        const voteResponse = await response.json();
        alert("Vote submitted! Thank you.");
        console.log("Vote response:", voteResponse);

        // Refresh poll data to show updated votes
        const updatedPoll = await fetchPoll(pollId);
        displayPoll(updatedPoll);
    } catch (error) {
        console.error("Error voting on poll:", error);
    }
}

// Main function to handle poll creation and display
async function initializePoll() {
    const pollId = await createPoll();
    console.log("Created poll ID:", pollId);
    if (pollId) {
        const pollData = await fetchPoll(pollId);
        console.log("Fetched poll data:", pollData);
        displayPoll(pollData);
    } else {
        console.error("Failed to create or fetch poll.");
    }
}


// Initialize poll when the page loads
window.onload = initializePoll;
