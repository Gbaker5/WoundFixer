//const deleteButton = document.querySelectorAll('.tester')
//
//
//    Array.from(deleteButton).forEach((element)=>{
//      element.addEventListener('click', deleteItem) //adds an event listener to each delete button 
//  });
//
//  async function deleteItem(){
//    const itemText = this.parentNode.childNodes[1].innerText //declares a variable that holds the location where info/data will be placed client-side
//    try{
//        const response = await fetch('deleteItem', { //sends a fetch request to delete item
//            method: 'delete', //delete method comes from 
//            headers: {'Content-Type': 'application/json'}, //formats data to allow us to use json 
//            body: JSON.stringify({ //turns json response into string 
//              'itemFromJS': itemText // (itemjs will now equal itemtext) grabbing the text and sending to backend to delete 
//            })
//          })
//        const data = await response.json() //declares a variable to hold the response that is received from the server after the fetch request
//        console.log(data) //console logs the json response
//        location.reload() //refreshes page
//        console.log("deleted")
//    }catch(err){
//        console.log(err) //catch error
//    }
//}
   

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

  images.forEach(img => {
    img.addEventListener('click', () => {
      modal.style.display = "block";
      modalImg.src = img.src;
    });
  });

  modal.addEventListener('click', () => {
    modal.style.display = "none";
  });
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

button.addEventListener('click', () => {
   // Rotate arrow
   arrow.classList.toggle('inactiveRotate');
  targetDiv.classList.toggle('hidden');
  button.textContent = targetDiv.classList.contains('hidden') ? 'Show' : 'Hide';
});

////////////Update roles
