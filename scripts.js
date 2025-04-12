/**
 * Data Catalog Project Starter Code - SEA Stage 2
 *
 * This file is where you should be doing most of your work. You should
 * also make changes to the HTML and CSS files, but we want you to prioritize
 * demonstrating your understanding of data structures, and you'll do that
 * with the JavaScript code you write in this file.
 *
 * The comments in this file are only to help you learn how the starter code
 * works. The instructions for the project are in the README. That said, here
 * are the three things you should do first to learn about the starter code:
 * - 1 - Change something small in index.html or style.css, then reload your
 *    browser and make sure you can see that change.
 * - 2 - On your browser, right click anywhere on the page and select
 *    "Inspect" to open the browser developer tools. Then, go to the "console"
 *    tab in the new window that opened up. This console is where you will see
 *    JavaScript errors and logs, which is extremely helpful for debugging.
 *    (These instructions assume you're using Chrome, opening developer tools
 *    may be different on other browsers. We suggest using Chrome.)
 * - 3 - Add another string to the titles array a few lines down. Reload your
 *    browser and observe what happens. You should see a fourth "card" appear
 *    with the string you added to the array, but a broken image.
 *
 */

import physicistObj from "./data/physicistDesc.js";




// Your final submission should have much more data than this, and
// you should use more than just an array of strings to store it all.
const templateCard = document.querySelector(".card"); // Copy the template card

// This function adds cards the page to display the data in the array
function createCards(dataObj) {
  const cardContainer = document.getElementById("card-container");
  const templateCard = document.querySelector(".card");
  cardContainer.innerHTML = "";

  // Grabs all the keys in the object and returns in array form
  const physicistNames = Object.keys(dataObj);

  // Update the UI element in the bottom right corner with the proper amount of physicists in the data object
  document.querySelector(".totalNumberOfCards").textContent = physicistNames.length;


  console.log(physicistNames);

  for (let i = 0; i < 3; i++) {

    // name of physicist
    const physicist = physicistNames[i];

    // The object associated with each physicist's name
    const physicistInfo = dataObj[physicist];

    const nextCard = templateCard.cloneNode(true);
    editCardContent(nextCard, physicist, physicistInfo); // Edit title and image
    cardContainer.appendChild(nextCard); // Add new card to the container

  }
}



function editCardContent(card, newTitle, physicistInfo) {

  // Change from display: none to display: flex
  card.style.display = "flex";

  // Indicate that the card is currently being displayed
  physicistInfo["Visible"] = "true";

  // Name of physicist (which is the header)
  card.physicist = newTitle;
  const cardHeader = card.querySelector("h2");
  cardHeader.textContent = newTitle;


  // Lifespan of physicist (birth to death)
  const lifespanText = card.querySelector(".lifespan");
  const lifespan = physicistInfo["Lifespan"];
  lifespanText.textContent = lifespan;


  // Most popular piece of work
  const popContributionText = card.querySelector(".popContribution");
  const popularContribution = physicistInfo["Popular Contribution"];

  popContributionText.textContent = popularContribution;


  // Number of papers published throughout lifttime
  const papersPublishedText = card.querySelector(".papersPublished");
  const papersPublished = physicistInfo["Papers Published"];

  papersPublishedText.textContent = papersPublished;
  

  // Picture of physicist
  const image = physicistInfo["Image"];
  const cardImage = card.querySelector("img");

  cardImage.src = image;
  cardImage.alt = newTitle + " Poster";

  // Logic for updating the amount of collected cards
  const isCollected = physicistInfo["Collected"];

  if (isCollected == "false") {

    const numberOfCollectedDOM = document.querySelector(".numberOfCollected")
    
    let numberOfCollected = numberOfCollectedDOM.getAttribute("data-collected");

    // Since we are "collecting" a card, we want to increment the number of collected  just before updating the data- attribute (hence the ++ before)
    numberOfCollectedDOM.setAttribute("data-collected", ++numberOfCollected);

    // Update the UI element with the new collected number
    numberOfCollectedDOM.textContent = numberOfCollected;

    // Update the data to indicate the card is already collected
    physicistInfo["Collected"] = "true";

  }

  const replaceButton = card.querySelector(".replaceButton");

  replaceButton.addEventListener("click", () => {
    console.log("I have been summoned!");
    replaceCard(card, physicistObj);

    physicistInfo["Visible"] = "false";
  });


  // This shows the delete/replace options on each card on hover
  card.addEventListener("mouseenter", toggleCardOptions);

  // This hides the delete/replace options on each card on hover
  card.addEventListener("mouseleave", toggleCardOptions);



  // You can use console.log to help you debug!
  // View the output by right clicking on your website,
  // select "Inspect", then click on the "Console" tab
  //console.log("new card:", newTitle, "- html: ", card);
}

// This calls the addCards() function when the page is first loaded
document.addEventListener("DOMContentLoaded", () => {
  createCards(physicistObj);
});


function toggleCardOptions(evt) {

  //console.log(evt);

  const eventType = evt.type;

  const card = evt.target;
  //console.log(card);

  const cardContent = card.querySelector(".card-content");

  const dropdown = card.querySelector(".cardDropdown");

  if (eventType == "mouseenter") {
    dropdown.setAttribute("data-toggle", "on");
    dropdown.style.transform = "scaleY(1)";

    cardContent.style.borderRadius = "5px 5px 0 0";
    changeBackgroundText(card.physicist);

  } else {
    dropdown.setAttribute("data-toggle", "off");
    dropdown.style.transform = "scaleY(0)";

    cardContent.style.borderRadius = "5px";
    changeBackgroundText("");
  }

}

function replaceCard(oldCard, dataObj) {
  let visibility = "true";

  let randomPhysicistName;
  let newPhysicist;

  while (visibility != "false") {

    const physicistNames = Object.keys(dataObj);

    // Math.random() returns numbers from 0 to 1, so we have to multiply by the length of the object of physicists
    // Floor is to ensure we don't go above the indices of the object
    const randomNumber = Math.floor(Math.random() * physicistNames.length);

    // Grabs random physicist name from physicistNames array
    randomPhysicistName = physicistNames[randomNumber];

    // Takes random name and grabs info from dataObj
    newPhysicist = dataObj[randomPhysicistName];

    // 
    visibility = newPhysicist["Visible"];
    console.log(randomPhysicistName);
  
  }

  // Effectively erases all the info on the old card and replaces it with the new physicist
  editCardContent(oldCard, randomPhysicistName, newPhysicist);


}

function changeBackgroundText(newName) {

  const backgroundText = document.querySelector(".backgroundText");

  const formattedName = newName.replace(" ", "<br>");

  // Animation
  backgroundText.style.opacity = 0;

  setTimeout(() => {
    backgroundText.innerHTML = formattedName;
  }, 50)

  setTimeout(() => {
    backgroundText.style.opacity = 1;
  }, 50)
}

function removeLastCard() {
  titles.pop(); // Remove last item in titles array
  showCards(); // Call showCards again to refresh
}
