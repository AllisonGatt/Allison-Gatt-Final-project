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

// Base URL and API Key
const API_URL = "https://api.pollsapi.com/v1/create/poll";
const API_KEY = "your_actual_api_key_here"; // Replace with your actual API key

// Function to create a poll
async function createPoll(question, options, identifier = null, data = {}) {
    // Construct the request payload
    const requestBody = {
        question: question,
        options: options.map(optionText => ({ text: optionText })), // Convert options array to API format
        identifier: identifier,
        data: data
    };

    try {
        // Make the POST request to the Polls API
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "api-key": API_KEY
            },
            body: JSON.stringify(requestBody)
        });

        // Check if the request was successful
        if (!response.ok) {
            const errorResponse = await response.json();
            throw new Error(`Error: ${errorResponse.message}`);
        }

        // Parse the JSON response
        const responseData = await response.json();

        // Log success message and poll details
        console.log("Poll created successfully:", responseData);
    } catch (error) {
        console.error("Error creating poll:", error);
    }
}

// Example usage
createPoll(
    "What type of volunteering do you think is most important?", // Poll question
    ["Donating money", "Donating time", "Donating resources"], // Poll options
);

createPoll(
    "What type of volunteering do you think you could make the greatest impact with?", // Poll question
    ["Donating money", "Donating time", "Donating resources"], // Poll options
);

    // Function to display polls
    function displayPolls(polls) {
        POLLS_CONTAINER.innerHTML = ""; // Clear existing polls
        if (polls.length === 0) {
            POLLS_CONTAINER.innerHTML = "<p>No polls available at the moment.</p>";
            return;
        }

        polls.forEach((poll) => {
            const pollDiv = document.createElement("div");
            pollDiv.classList.add("poll");

            const question = document.createElement("h3");
            question.textContent = poll.question;

            const optionsList = document.createElement("ul");

            poll.options.forEach((option) => {
                const optionItem = document.createElement("li");

                const optionText = document.createElement("span");
                optionText.textContent = `${option.text} (${option.votes_count} votes)`;

                const voteButton = document.createElement("button");
                voteButton.textContent = "Vote";
                voteButton.addEventListener("click", () => voteOnOption(option.id));

                optionItem.appendChild(optionText);
                optionItem.appendChild(voteButton);
                optionsList.appendChild(optionItem);
            });

            pollDiv.appendChild(question);
            pollDiv.appendChild(optionsList);
            POLLS_CONTAINER.appendChild(pollDiv);
        });
    }

    // Function to vote on a poll option
    async function voteOnOption(optionId) {
        try {
            const response = await fetch(`${API_URL}/add/vote`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "api-key": API_KEY,
                },
                body: JSON.stringify({ option_id: optionId }),
            });

            if (!response.ok) {
                throw new Error("Failed to submit vote.");
            }

            alert("Thank you for voting!");
            fetchPolls(); // Reload polls to reflect updated votes
        } catch (error) {
            console.error("Error voting:", error);
            alert("Could not submit your vote. Please try again later.");
        }
    }

    // Fetch polls on page load
    fetchPolls();
