const deleteButton = document.querySelectorAll('.tester')


    Array.from(deleteButton).forEach((element)=>{
      element.addEventListener('click', deleteItem) //adds an event listener to each delete button 
  });

  async function deleteItem(){
    const itemText = this.parentNode.childNodes[1].innerText //declares a variable that holds the location where info/data will be placed client-side
    try{
        const response = await fetch('deleteItem', { //sends a fetch request to delete item
            method: 'delete', //delete method comes from 
            headers: {'Content-Type': 'application/json'}, //formats data to allow us to use json 
            body: JSON.stringify({ //turns json response into string 
              'itemFromJS': itemText // (itemjs will now equal itemtext) grabbing the text and sending to backend to delete 
            })
          })
        const data = await response.json() //declares a variable to hold the response that is received from the server after the fetch request
        console.log(data) //console logs the json response
        location.reload() //refreshes page
        console.log("deleted")
    }catch(err){
        console.log(err) //catch error
    }
}
   

/////////////Toggle for each Hidden classs
