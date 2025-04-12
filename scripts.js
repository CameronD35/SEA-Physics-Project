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

  const physicistNames = Object.keys(dataObj);

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
  
  card.physicist = newTitle;
  const cardHeader = card.querySelector("h2");
  cardHeader.textContent = newTitle;

  // Lifespan of physicist (birth to death)
  const lifespan = physicistInfo["Lifespan"];

  // Most popular piece of work
  const mostPopularContribution = physicistInfo["Most Popular Contribution"];

  // Number of papers published throughout lifttime
  const papersPublished = physicistInfo["Papers Published"];

  // Picture of physicist
  const image = physicistInfo["Image"];


  card.style.display = "flex";

  //const publishedStat = card.querySelector();

  const cardImage = card.querySelector("img");
  cardImage.src = image;
  cardImage.alt = newTitle + " Poster";

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

function quoteAlert() {
  console.log("Button Clicked!");
  alert(
    "I guess I can kiss heaven goodbye, because it got to be a sin to look this good!"
  );
}

function toggleCardOptions(evt) {

  console.log(evt);

  const eventType = evt.type;

  const card = evt.target;
  console.log(card);

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
