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
                question: "What is better to donate?",
                options: [
                    { text: "Time" },
                    { text: "Resources" }
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



const poll_Id_charity = "674f7528382aba0016f1d38d";

// Function to fetch poll data
async function fetchPoll(poll_Id_charity) {
    try {
        console.log("Fetching poll data for ID:", poll_Id_charity);
        const response = await fetch(`${API_BASE_URL}/get/poll/${poll_Id_charity}`, {
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
async function voteOnPoll(poll_Id_charity, optionId, identifier) {
    try {
        const response = await fetch("https://api.pollsapi.com/v1/create/vote", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "api-key": API_KEY
            },
            body: JSON.stringify({
                poll_id: poll_Id_charity,
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

        // Fetch and display updated votes
        const updatedVotes = await fetchPollVotes(poll_Id_charity);
        displayVotes(updatedVotes);
    } catch (error) {
        console.error("Error voting on poll:", error);
    }
}

// Function to fetch all votes for a specific poll
async function fetchVotes(pollId) {
    try {
        const response = await fetch(`https://api.pollsapi.com/v1/get/votes/${pollId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "api-key": API_KEY,
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch votes");
        }

        const fetchedData = await response.json();
        console.log("Fetched vote data:", fetchedData);

        const totalVotes = fetchedData?.data?.totalDocs || 0;
        const votesOnPage = fetchedData?.data?.docs || [];

        console.log("Total Votes:", totalVotes);
        console.log("Votes on this page:", votesOnPage);

        votesOnPage.forEach(vote => {
            const user = vote.identifier || "Anonymous";
            const optionText = getOptionTextById(vote.option_id, pollOptions) || "Unknown Option";

            voteContainer.innerHTML += `
                <p>${user} voted for ${optionText}</p>
            `;
        });
    } catch (error) {
        console.error("Error fetching votes:", error);
    }
}



const OFFSET = 0;
const LIMIT = 25;

fetchPollVotes(poll_Id_charity, OFFSET, LIMIT).then((voteData) => {
    if (voteData) {
        console.log("Total Votes:", voteData.totalDocs);
        console.log("Votes on this page:", voteData.docs);

        // Example: Display vote details
        voteData.docs.forEach((vote) => {
            console.log(`Vote ID: ${vote.id}, Option ID: ${vote.option_id}`);
        });
    } else {
        console.log("No vote data retrieved.");
    }
});


// Function to render the votes on the page
function displayVotes(votes) {
    const votesContainer = document.getElementById("votes-container");

    // Clear previous content
    votesContainer.innerHTML = "";

    // Ensure votes is an array
    if (!Array.isArray(votes)) {
        console.error("Votes is not an array:", votes);
        votesContainer.textContent = "Unable to load votes.";
        return;
    }

    // Handle no votes case
    if (votes.length === 0) {
        const noVotesMessage = document.createElement("p");
        noVotesMessage.textContent = "No votes yet.";
        votesContainer.appendChild(noVotesMessage);
        return;
    }

    // Render each vote
    votes.forEach(vote => {
        const voteElement = document.createElement("div");
        voteElement.classList.add("vote");

        const identifier = vote.identifier;
        const optionText = getOptionTextById(vote.option_id);

        voteElement.innerHTML = `<strong>${identifier}</strong> voted for <strong>${optionText}</strong>`;
        votesContainer.appendChild(voteElement);
    });
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
    const votes = await fetchPollVotes(poll_Id_charity);
    displayVotes(votes);
}

// Call showPollVotes with the poll_Id_charity to display votes after poll is created or fetched
async function initializePoll() {
    const poll_Id_charity = await createPoll();
    console.log("Created poll ID:", poll_Id_charity);
    if (poll_Id_charity) {
        const pollData = await fetchPoll(poll_Id_charity);
        console.log("Fetched poll data:", pollData);
        displayPoll(pollData);

        // Fetch and display votes for the created poll
        showPollVotes(poll_Id_charity);
    } else {
        console.error("Failed to create or fetch poll.");
    }
}

// Initialize poll when the page loads
window.onload = initializePoll;
