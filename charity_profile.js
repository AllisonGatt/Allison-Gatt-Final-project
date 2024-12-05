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

document.getElementById("listViewButton").addEventListener("click", listView);
document.getElementById("gridViewButton").addEventListener("click", gridView);
