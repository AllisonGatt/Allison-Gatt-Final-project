// INTEGRATING API

const POLLS_CONTAINER = document.getElementById("polls-container");
const ERROR_MESSAGE = document.getElementById("error-message");
const API_KEY = "6PMJYJ7EZ6M486KNBGAP812KCBJ0";
const API_BASE_URL = "https://api.pollsapi.com/v1";


// Function to create a poll
async function createPoll() {
    const API_URL_Create = "https://api.pollsapi.com/v1/create/poll"; 

    try {
        const response = await fetch(API_URL_Create, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "api-key": API_KEY,
            },
            body: JSON.stringify({
                question: "What do you think is best to donate?",
                options: [
                    { text: "Time" },
                    { text: "Resources" },
                    { text: "money"}
                ]
            })
        });

        if (!response.ok) {
            console.error("Failed to create poll:", response.statusText);
            throw new Error(`Error creating poll: ${await response.text()}`);
        }

        const pollData = await response.json();
        console.log("Poll created successfully:", pollData);

        // Ensure `pollData` contains the poll ID
        const pollId = pollData?.data?.id;
        if (!pollId) {
            throw new Error("Poll ID is missing in API response.");
        }

        return pollId;
    } catch (error) {
        console.error("Error in createPoll:", error);
        return null; // Return null to signify failure
    }
}

const pollId = "674f7528382aba0016f1d38d";

// Function to fetch poll data
async function fetchPoll(pollId) {
    try {
        console.log("Fetching poll data for ID:", pollId);
        const response = await fetch(`${API_BASE_URL}/get/poll/${pollId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "api-key": API_KEY
            }
        });

        if (!response.ok) {
            console.error("Failed to fetch poll:", response.status, response.statusText);
            throw new Error(`Error fetching poll: ${await response.text()}`);
        }

        const pollData = await response.json();
        console.log("Fetched poll data:", pollData);
        return pollData.data; // Ensure correct data structure
    } catch (error) {
        console.error("Error fetching poll:", error);
        return null; // Return null if fetch fails
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
async function voteOnPoll(pollId, optionId, identifier) {
    try {
        const response = await fetch("https://api.pollsapi.com/v1/create/vote", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "api-key": API_KEY
            },
            body: JSON.stringify({
                poll_id: pollId,
                option_id: optionId,
                identifier: identifier
            })
        });

        if (!response.ok) {
            const errorResponse = await response.json();
            throw new Error(`Error voting: ${errorResponse.message}`);
        }

        const voteResponse = await response.json();
        console.log("Vote response:", voteResponse);

        alert("Vote submitted! Thank you.");

    } catch (error) {
        console.error("Error voting on poll:", error);
    }
}


// Call showPollVotes with the pollId to display votes after poll is created or fetched
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
