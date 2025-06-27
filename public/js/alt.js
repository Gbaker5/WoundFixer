console.log("alt.js loaded")
   

/////////////Toggle for each Hidden class to handle error on physician Pt page
document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".toggleFormBtn");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const formContainer = button.nextElementSibling;

      if (formContainer && formContainer.classList.contains("updateInputBox")) {
        formContainer.classList.toggle("hidden");

        const arrow = button.querySelector(".arrow-icon");
        if (arrow) {
          arrow.classList.toggle("rotate");
        }
      }
    });
  });

  // Auto-open form based on flash message
  const showFormWoundIdInput = document.getElementById("showFormWoundId");
  if (showFormWoundIdInput) {
    const showFormWoundId = showFormWoundIdInput.value;
    if (showFormWoundId) {
      const targetButton = document.querySelector(`.toggleFormBtn[data-wound-id="${showFormWoundId}"]`);
      if (targetButton) {
        const formContainer = targetButton.nextElementSibling;
        formContainer.classList.remove("hidden");
        const arrow = targetButton.querySelector(".arrow-icon");
        if (arrow) arrow.classList.add("rotate");
      }
    }
  }
});

//////////////Fullscreen Images

document.addEventListener("DOMContentLoaded", () => {
  const images = document.querySelectorAll('.enlargeable');
  const modal = document.getElementById('fullscreenModal');
  const modalImg = document.getElementById('modalImage');

  if(images){
  images.forEach(img => {
    img.addEventListener('click', () => {
      modal.style.display = "block";
      modalImg.src = img.src;
    });
  });
  }

  if(modal){
    modal.addEventListener('click', () => {
      modal.style.display = "none";
    });
  }

 
});


//////////Active/Inactive Slider
document.querySelectorAll('.toggle-track').forEach(toggle => {
  toggle.addEventListener('click', async () => {
    const woundId = toggle.dataset.woundId;// Get the wound ID from the data attribute (data-wound-id) on the clicked toggle
    const isActive = toggle.classList.contains('active'); // Check if the current toggle has the 'active' class
    const newActive = !isActive; // Determine the new active state by inverting the current one

    toggle.classList.toggle('active', newActive);// Toggle the 'active' class based on the new state
    toggle.classList.toggle('inactive', !newActive);// Toggle the 'inactive' class in the opposite way

     // Send a PUT request to the server to update the 'active' state in the database
    await fetch(`/physicianP/${woundId}/toggleActive`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: newActive }) // Send new active status in the body
    });
  });
});



/////////Toggle Show/Hide inactive Wounds
const button = document.querySelector('.showButton');
const targetDiv = document.querySelector('.inactiveWounds-ct');
const arrow = document.querySelector('.inactiveArrow')

if(button){
  button.addEventListener('click', () => {
    // Rotate arrow
    arrow.classList.toggle('inactiveRotate');
   targetDiv.classList.toggle('hidden');
   button.textContent = targetDiv.classList.contains('hidden') ? 'Show' : 'Hide';
 });
}


////////////Update roles
document.addEventListener("DOMContentLoaded", () => {
  const saveBtn = document.getElementById("saveRolesBtn");

  if (!saveBtn) {
    console.error("Save button not found!");
    return;
  }

  
  saveBtn.addEventListener("click", async () => {
    const rows = document.querySelectorAll(".role-row");
    const updates = [];
  

    rows.forEach(row => {
      const userId = row.dataset.userId;
      const newRole = row.querySelector(".role-select").value;
      updates.push({ userId, newRole });
    });
  
    try {
      const res = await fetch("/updateRoles", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "same-origin", // includes JWT cookie
        body: JSON.stringify({ updates })
      });

      const result = await res.json();
      if (result.success) {
        alert("Roles updated successfully");

        // Optionally update the UI in-place
        rows.forEach(row => {
          const newRole = row.querySelector(".role-select").value;
          row.querySelector(".current-role").innerText = newRole;
        });

      } else {
        alert("Error updating roles: " + result.message);
      }
    } catch (err) {
      console.error(err);
      alert("Network error while updating roles.");
    }
  });
});
