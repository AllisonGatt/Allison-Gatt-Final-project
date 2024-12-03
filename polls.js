//INTEGRATING API 

const API_URL = "https://api.pollsapi.com/v1";
const POLLS_CONTAINER = document.getElementById("polls-container");
const ERROR_MESSAGE = document.getElementById("error-message");
const API_KEY = "6PMJYJ7EZ6M486KNBGAP812KCBJ0";
const API_BASE_URL = "https://api.pollsapi.com";


// Function to create a poll
async function createPoll() {
    try {
        const response = await fetch(`${API_BASE_URL}/create/poll`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "api-key": API_KEY
            },
            body: JSON.stringify({
                question: "What is better to donate?",
                options: [
                    { text: "Time" },
                    { text: "Resources" }
                ]
            })
        });

        if (!response.ok) {
            const errorResponse = await response.json();
            throw new Error(`Error creating poll: ${errorResponse.message}`);
        }

        const pollData = await response.json();
        console.log("Poll created:", pollData);
        return pollData.data.id; // Return the poll ID
    } catch (error) {
        console.error("Error creating poll:", error);
    }
}

// Function to fetch poll data
async function fetchPoll(pollId) {
    try {
        const response = await fetch(`${API_BASE_URL}/poll/${pollId}`, {
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
    const pollContainer = document.getElementById("pollContainer");
    pollContainer.innerHTML = ""; // Clear previous content

    // Create poll question
    const questionElement = document.createElement("h2");
    questionElement.textContent = poll.question;
    pollContainer.appendChild(questionElement);

    // Create options
    poll.options.forEach(option => {
        const optionButton = document.createElement("button");
        optionButton.textContent = option.text;
        optionButton.onclick = () => voteOnPoll(poll.id, option.id);
        pollContainer.appendChild(optionButton);
    });
}

// Function to vote on a poll
async function voteOnPoll(pollId, optionId) {
    try {
        const response = await fetch(`${API_BASE_URL}/poll/${pollId}/vote`, {
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
    const pollId = await createPoll(); // Create the poll and get the ID
    if (pollId) {
        const pollData = await fetchPoll(pollId); // Fetch the poll data
        displayPoll(pollData); // Render the poll on the page
    }
}

// Initialize poll when the page loads
window.onload = initializePoll;
