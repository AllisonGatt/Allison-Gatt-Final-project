//INTEGRATING API 

const POLLS_CONTAINER = document.getElementById("polls-container");
const ERROR_MESSAGE = document.getElementById("error-message");
const API_KEY = "6PMJYJ7EZ6M486KNBGAP812KCBJ0";
const API_BASE_URL = "https://api.pollsapi.com/v1";

const poll_Id_charity = "674f7528382aba0016f1d38d"


// Function to create a poll
async function createPoll() {
    const API_URL_Create = "https://api.pollsapi.com/v1/create/poll"; 

    try {
        console.log("API Key:", API_KEY);
        console.log("API Endpoint:", API_URL_Create);

        const response = await fetch(API_URL_Create, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "api-key": API_KEY,
            },
            body: JSON.stringify({
                question: "What is better to donate?",
                options: [
                    { text: "Time" },
                    { text: "Resources" }
                ]
            })
        });

        const responseText = await response.text();
        console.log("Raw API Response:", responseText);

        if (!response.ok) {
            console.error("Response not OK. Status:", response.status);
            console.error("Response Status Text:", response.statusText);
            throw new Error(`Error creating poll: ${responseText}`);
        }

        let pollData;
        try {
            pollData = JSON.parse(responseText);
        } catch (parseError) {
            console.error("Error parsing JSON response:", parseError);
            throw new Error("Invalid JSON response from the API.");
        }

        console.log("Poll created successfully:", pollData);

        // Check if pollData has the expected structure
        console.log("Poll Data:", pollData);
        return pollData?.data?.id; // Safely return the poll ID
    } catch (error) {
        console.error("Error in createPoll function:", error);
    }
}

// Function to fetch poll data
async function fetchPoll(poll_Id_charity) {
    try {
        const response = await fetch(`${API_BASE_URL}/get/poll/${poll_Id_charity}`, {
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
async function voteOnPoll(poll_Id_charity, optionId, identifier) {
    try {
        const response = await fetch("https://api.pollsapi.com/v1/create/vote", {  // Updated URL
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "api-key": API_KEY
            },
            body: JSON.stringify({
                poll_id: poll_Id_charity,   // Poll ID to vote on
                option_id: optionId,  // Option ID to vote for
                identifier: identifier  // Custom identifier for the vote
            })
        });

        if (!response.ok) {
            const errorResponse = await response.json();
            throw new Error(`Error voting: ${errorResponse.message}`);
        }

        const voteResponse = await response.json();
        alert("Vote submitted! Thank you.");
        console.log("Vote response:", voteResponse);

        // Refresh poll data to show updated votes
        const updatedPoll = await fetchPoll(poll_Id_charity);
        displayPoll(updatedPoll);
    } catch (error) {
        console.error("Error voting on poll:", error);
    }
}


// Function to fetch all votes for a specific poll
async function fetchVotes(poll_Id_charity) {
    try {
        const response = await fetch(`${API_BASE_URL}/get/votes/${poll_Id_charity}?offset=0&limit=100`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "api-key": API_KEY
            }
        });

        if (!response.ok) {
            const errorResponse = await response.json();
            throw new Error(`Error fetching votes: ${errorResponse.message}`);
        }

        const votesData = await response.json();
        return votesData.data.docs; // Return the votes data
    } catch (error) {
        console.error("Error fetching votes:", error);
    }
}

// Function to render the votes on the page
function displayVotes(votes) {
    const votesContainer = document.getElementById("votes-container"); // Create or get this container

    // Clear previous content
    votesContainer.innerHTML = "";

    // Check if there are any votes
    if (votes.length === 0) {
        const noVotesMessage = document.createElement("p");
        noVotesMessage.textContent = "No votes yet.";
        votesContainer.appendChild(noVotesMessage);
    } else {
        // Render each vote
        votes.forEach(vote => {
            const voteElement = document.createElement("div");
            voteElement.classList.add("vote");

            const identifier = vote.identifier;
            const optionId = vote.option_id;

            // Find the corresponding option text for the option_id
            const optionText = getOptionTextById(optionId); // This should be a function that maps option IDs to option text

            voteElement.innerHTML = `<strong>${identifier}</strong> voted for <strong>${optionText}</strong>`;

            votesContainer.appendChild(voteElement);
        });
    }
}

// Function to get the option text by ID (You should map this according to your options)
function getOptionTextById(optionId) {
    // Example: Hardcoded options for mapping, you can adjust based on your actual poll options
    const options = {
        "674f7528382aba0016f1d38e": "Time",
        "674f7528382aba0016f1d38f": "Resources"
    };

    return options[optionId] || "Unknown Option";
}

// Function to fetch and display votes
async function showPollVotes(poll_Id_charity) {
    const votes = await fetchVotes(poll_Id_charity);
    displayVotes(votes);
}

// Call showPollVotes with the poll_Id_charity to display votes after poll is created or fetched
async function initializePoll() {
    const poll_Id_charity = await createPoll();
    console.log("Created poll ID:", poll_Id_charity);
    if (poll_Id_charity) {
        const pollData = await fetchPoll(poll_Id_charity);
        console.log("Fetched poll data:", poll_Id_charity);
        displayPoll(poll_Id_charity);

        // Fetch and display votes for the created poll
        showPollVotes(poll_Id_charity);
    } else {
        console.error("Failed to create or fetch poll.");
    }
}


// Initialize poll when the page loads
window.onload = initializePoll;
