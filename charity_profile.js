document.addEventListener("DOMContentLoaded", () => {
    // This selects the specific Volunteer now button
    const volunteerButton = document.getElementById("volunteerButton");

    // This creates the form dynamically, and is hidden at first
    const form = document.createElement("form");
    form.setAttribute("id", "volunteerForm");
    form.style.display = "none"; 
    form.innerHTML = `
        <h2>Volunteer Information</h2>
        <label for="name">Name:</label>
        <input type="text" id="name" name="name" required><br><br>
        
        <label for="email">Email:</label>
        <input type="email" id="email" name="email" required><br><br>
        
        <label for="phone">Phone Number:</label>
        <input type="tel" id="phone" name="phone"><br><br>
        
        <button type="submit">Submit</button>
        <button type="button" id="cancelButton">Cancel</button>
    `;

    // This appends the form to the body 
    document.body.appendChild(form);

    // Once the "Volunteer Now" button is clicked, the form is shown 
    volunteerButton.addEventListener("click", () => {
        form.style.display = "block";
        volunteerButton.style.display = "none"; // Hide the button
    });

    // This gives the user the ability to cancel the form 
    const cancelButton = document.getElementById("cancelButton");
    cancelButton.addEventListener("click", () => {
        form.style.display = "none";
        volunteerButton.style.display = "block"; // Show the button again
    });

    // this handles the form submission, shows the button again and resets the form 
    form.addEventListener("submit", (e) => {
        e.preventDefault(); 
        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const phone = document.getElementById("phone").value;

        alert(`Thank you for volunteering, ${name}! We will contact you at ${email}.`);
        form.style.display = "none";
        volunteerButton.style.display = "block"; 
        form.reset(); 
    });
});


//This is the added second element to enhance the interactivity and dynamism of the charity profile pages
//per assignment instructions 
document.addEventListener("DOMContentLoaded", () => {
    const donateButton = document.getElementById("donateButton");
    const donateModal = document.getElementById("donateModal");
    const closeDonateModal = document.getElementById("closeDonateModal");
    const closeModalBtns = document.querySelectorAll(".close");

    // this opens the modal if the donate now button is clicked
    donateButton.addEventListener("click", () => {
        donateModal.style.display = "block";
    });

    // this closes the modal of the 'x' is clocked 
    closeDonateModal.addEventListener("click", () => {
        donateModal.style.display = "none";
    });

    // this closes the modal if the user clicks outside the window
    window.addEventListener("click", (event) => {
        if (event.target === donateModal) {
            donateModal.style.display = "none";
        }
    });

    //this closes the modal
    closeModalBtns.forEach(button => {
        button.addEventListener("click", () => {
            donateModal.style.display = "none";
        });
    });
});

//additional script for list/grid view on charitieslist.html
var elements = document.getElementsByClassName("column");

var i;

// List View
function listView() {
  for (i = 0; i < elements.length; i++) {
    elements[i].style.width = "100%";
  }
}

// Grid View
function gridView() {
  for (i = 0; i < elements.length; i++) {
    elements[i].style.width = "50%";
  }
}

//INTEGRATING API 

    const API_URL = "https://api.pollsapi.com/v1";
    const POLLS_CONTAINER = document.getElementById("polls-container");
    const ERROR_MESSAGE = document.getElementById("error-message");
    const API_KEY = "6PMJYJ7EZ6M486KNBGAP812KCBJ0";
// Base API details
const API_BASE_URL = "https://api.pollsapi.com/v1";
const API_KEY = "your_actual_api_key_here"; // Replace with your API key

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
