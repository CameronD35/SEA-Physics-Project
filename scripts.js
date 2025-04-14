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

let maxNumOfCards = 3;

const startTime = getTime();


// Your final submission should have much more data than this, and
// you should use more than just an array of strings to store it all.
const templateCard = document.querySelector(".card"); // Copy the template card

// This calls the addCards() function when the page is first loaded
document.addEventListener("DOMContentLoaded", () => {
  createCards(physicistObj, 3);
});

window.addEventListener("resize", (evt) => {
  const windowWidth = evt.target.innerWidth
  adjustToScreenSize(windowWidth)
})

// This function adds cards the page to display the data in the array
function createCards(dataObj, amount, startIndex=0) {
  const cardContainer = document.getElementById("card-container");
  const templateCard = document.querySelector(".card");
  cardContainer.innerHTML = "";

  // Grabs all the keys in the object and returns in array form
  const physicistNames = Object.keys(dataObj);

  // Update the UI element in the bottom right corner with the proper amount of physicists in the data object
  document.querySelector(".totalNumberOfCards").textContent = physicistNames.length;
  document.querySelector(".numberOfCollected").textContent = amount;


  //console.log(physicistNames);

  for (let i = 0; i < amount; i++) {

    // name of physicist
    const physicist = physicistNames[i];

    // The object associated with each physicist's name
    const physicistInfo = dataObj[physicist];

    const nextCard = templateCard.cloneNode(true);
    nextCard.id = `card${i + startIndex}`;

    //console.log(physicistInfo)
    editCardContent(nextCard, physicist, physicistInfo); // Edit title and image
    cardContainer.appendChild(nextCard); // Add new card to the container
    //replaceCard(nextCard, physicistObj)
  }
}



function editCardContent(card, newTitle, physicistInfo) {

  //console.log(physicistInfo);

  // Change from display: none to display: flex
  card.style.display = "flex";

  // Indicate that the card is currently being displayed
  physicistInfo["Visible"] = "true";

  //console.log(card);

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
  cardImage.alt = newTitle + " Image";

  // Logic for updating the amount of collected cards
  const isCollected = physicistInfo["Collected"];

  if (isCollected == "false") {

    const numberOfCollectedDOM = document.querySelector(".numberOfCollected")
    
    // Gathers number of currently collected cards
    let numberOfCollected = numberOfCollectedDOM.getAttribute("data-collected");

    // Since we are "collecting" a card, we want to increment the number of collected  just before updating the data- attribute (hence the ++ before)
    numberOfCollectedDOM.setAttribute("data-collected", ++numberOfCollected);

    // Update the UI element with the new collected number
    numberOfCollectedDOM.textContent = numberOfCollected;

    // Update the data to indicate the card is already collected
    physicistInfo["Collected"] = "true";

  }

  const replaceButton = card.querySelector(".replaceButton");

  // Event listener for replace card button
  // The third argument, "{once: true}", prevents the editCardContent() function from 
  // adding a duplicate event listener to the card
  // once removes the event listener upon activation
  replaceButton.addEventListener("click", () => {
    console.log("I have been summoned!");

    replaceCard(card, physicistObj);

    physicistInfo["Visible"] = "false";

    //console.log(physicistObj);

  }, {once: true});

  const deleteButton = card.querySelector(".deleteButton");
  console.log(`Added delete fn to ${card}`);
  // comments
  
  deleteButton.addEventListener("click", () => {
    console.log("I have been summoned!");

    deleteCard(card);

    physicistInfo["Visible"] = "false";

    //console.log(physicistObj);

  }, {once: true});

  const cardContent = card.querySelector(".card-content");

  cardContent.addEventListener("click", () => {
    console.log("clicked in card");

    displayDesc(physicistInfo, newTitle);
  })



  // This shows the delete/replace options on each card on hover
  card.addEventListener("mouseenter", toggleCardOptions);

  // This hides the delete/replace options on each card on hover
  card.addEventListener("mouseleave", toggleCardOptions);

}


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

  let randomPhysicistName;
  let newPhysicist;

  let physicistNames = Object.keys(dataObj);
  // console.log(physicistNames);

  // Goes through and filters the array to see what physicists already have a card being displayed
  // In order to prevent iterating through all the physicists, we cannot increment when we find a "visible" physicist
  let i = 0;

  while (i < physicistNames.length) {

    const name = physicistNames[i];

    const physicistInfo = dataObj[name];

    //console.log(i);

    if (physicistInfo["Visible"] == "true") {

      const physicistIndex = physicistNames.indexOf(name);

      physicistNames.splice(physicistIndex, 1);

    } else {

      i++;
    
    }
  }

  let oldPhysicist = dataObj[oldCard.physicist];

  oldPhysicist["Visible"] = "false";

  // Math.random() returns numbers from 0 to 1, so we have to multiply by the length of the object of physicists
  // Floor is to ensure we don't go above the indices of the object
  const randomNumber = Math.floor(Math.random() * physicistNames.length);

  // Grabs random physicist name from the filtered physicistNames array
  randomPhysicistName = physicistNames[randomNumber];

  // Takes random name and grabs info from dataObj
  newPhysicist = dataObj[randomPhysicistName];

  //console.log(physicistNames, newPhysicist, randomPhysicistName, randomNumber);

  const cardContainer = document.getElementById("card-container");
  
  // Effectively erases all the info on the old card and replaces it with the new physicist
  editCardContent(oldCard, randomPhysicistName, newPhysicist);

}

function deleteCard(card) {

  const cardContainer = document.getElementById("card-container");
  let numOfCards = cardContainer.children.length;

  if (numOfCards < 2) {
    console.log("test");

    let finalDecision = false;
    const firstDecision = confirm("Are you sure you want to do this?");

    if (firstDecision) {

      const secondDecision = confirm("Are you really sure?");

      if (secondDecision) {

        const thirdDecision = confirm("Are you really really sure? (This is your last chance)");

        if (thirdDecision) {

          const fourthDecision = confirm("Just kidding, but for real, this is your last chance.");

          finalDecision = fourthDecision

        } else {
          return;
        }
      } else {
        return;
      }
    } else {
      return;
    }


    if (finalDecision) {

      let background = document.querySelector(".background");

    background.style.backgroundImage = "url(AJourneyThroughPhysicsLogo.png)";

      changeBackgroundText("");
      createCards(physicistObj, 3);
    }
    //showOverlay();
  }
  
  console.log(numOfCards, maxNumOfCards);

  if (numOfCards <= maxNumOfCards) {

    toggleAddCardButton(false);

  } else {

    toggleAddCardButton(true);

  }


  // This addresses an odd issue where the deleteCard() function seems to be called twice
  if (cardContainer.contains(card)) {
    cardContainer.removeChild(card);
  }

  console.log(card.physicist);
  const physicistBeingDeleted = physicistObj[card.physicist];

  physicistBeingDeleted["Visible"] = "false";



  //console.log(numOfCards);
  //console.log(cardID);
}

function addCard(evt) {

  const cardContainer = document.getElementById("card-container");
  const templateCard = document.querySelector(".card");

  let numOfCards = cardContainer.children.length;

  // Grabs all the keys in the object and returns in array form
  const physicistNames = Object.keys(physicistObj);


  //console.log(physicistNames);


  // name of physicist
  const physicist = physicistNames[numOfCards];

  // The object associated with each physicist's name
  const physicistInfo = physicistObj[physicist];

  const nextCard = templateCard.cloneNode(true);
  nextCard.id = `card${numOfCards}`;
  editCardContent(nextCard, physicist, physicistInfo); // Edit title and image
  cardContainer.appendChild(nextCard); // Add new card to the container
  

  // Done to prevent newly added cards from being duplicates
  replaceCard(nextCard, physicistObj); 

  const replacementPhysicist = physicistObj[nextCard.physicist];

  //replacementPhysicist["Visible"] = "true"

  // The number of cards prior to addition will also be the number appended to the new card
  // since the card numbers start from 0 (whereas length starts from 1)
  //console.log(cardContainer);

  if (++numOfCards >= maxNumOfCards) {
    toggleAddCardButton(true);
  }

}

function toggleAddCardButton(hideButton) {
  const addCardButton = document.querySelector(".addCardButton");

  const isVisible = addCardButton.getAttribute("data-visible");

  if (isVisible == "false") {
    addCardButton.style.transform = "scaleX(1) scaleY(1)";
    addCardButton.addEventListener("click", addCard);

    addCardButton.setAttribute("data-visible", "true");

  } else if (hideButton) {
    console.log("test");
    addCardButton.style.transform = "scaleX(0) scaleY(0)";
    addCardButton.removeEventListener("click", addCard);

    addCardButton.setAttribute("data-visible", "false");
  }

  console.log("is this working tho?");

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

function displayDesc(physicistInfo, name) {
  const overlayContent = showOverlay();

  const imgSection = overlayContent.querySelector(".imgSection");

  const title = imgSection.querySelector(".physicistDescTitle");

  title.textContent = name;

  const img = imgSection.querySelector(".physicistDescImg");

  img.src = physicistInfo["Image"];

  const backgroundImg = imgSection.querySelector(".backgroundImg");

  backgroundImg.src = physicistInfo["Image"];


  const infoSection = overlayContent.querySelector(".infoSection");

  // Lifespan of physicist (birth to death)
  const lifespanText = infoSection.querySelector(".descLifespan");
  const lifespan = physicistInfo["Lifespan"];
  lifespanText.textContent = lifespan;


  // Most popular piece of work
  const popContributionText = infoSection.querySelector(".descPopContribution");
  const popularContribution = physicistInfo["Popular Contribution"];

  popContributionText.textContent = popularContribution;


  // Number of papers published throughout lifttime
  const papersPublishedText = infoSection.querySelector(".descPapersPublished");
  const papersPublished = physicistInfo["Papers Published"];

  papersPublishedText.textContent = papersPublished;

  const descriptionSection = infoSection.querySelector(".physicistDesc");
  const description = physicistInfo["Description"];

  descriptionSection.textContent = description;

}

function promptForConfirmation() {
  const overlayContent = showOverlay();
}

function showOverlay() {
  const overlay = document.querySelector(".overlay");
  const overlayProperties = overlay.style;

  overlayProperties.transform = "scaleX(1) scaleY(1)";
  overlayProperties.pointerEvents = "all";

  const heroProperties = document.querySelector(".hero").style;

  heroProperties.filter = "blur(4px)";

  window.addEventListener("click", hideOverlay);

  return overlay.querySelector(".overlayContent")
}

function hideOverlay(evt) {
  const overlay = document.querySelector(".overlay");
  const overlayProperties = overlay.style;

  const heroProperties = document.querySelector(".hero").style;


  const target = evt.target;

  const containsOverlay = target.contains(overlay);

  //console.log(target, containsOverlay);

  if (containsOverlay) {
    overlayProperties.transform = "scaleX(0) scaleY(0)";
    overlayProperties.pointerEvents = "none";
    
    heroProperties.filter = "";
  }
}

function adjustToScreenSize(screenWidthPx) {

  const hero = document.querySelector(".hero");
  const currentSizing = hero.getAttribute("data-sizing");
  const allCards = document.querySelector("#card-container").children;
  const currentNumOfCards = allCards.length;

  const normalSizingMinPx = 1000;
  const mediumSizingMinPx = 650;

  let newSizing;

  if (screenWidthPx >= normalSizingMinPx) {
    
    maxNumOfCards = 3;
    newSizing = "normal";

  } else if (screenWidthPx >= mediumSizingMinPx) {
    
    maxNumOfCards = 2;
    newSizing = "reduced";

  } else {

    maxNumOfCards = 1;
    newSizing = "greatlyReduced";

  }

  if (currentSizing == newSizing) {

    return;

  } else {

    hero.setAttribute("data-sizing", newSizing);
    console.log(`Size now ${newSizing}. Max Cards: ${maxNumOfCards}, Current Cards: ${currentNumOfCards}`);
    let i = currentNumOfCards;

    if (currentNumOfCards < maxNumOfCards) {
      
      toggleAddCardButton(false);

    } else {

      toggleAddCardButton(true);

    }

    while (i > maxNumOfCards) {

      const currentLastCard = allCards[i - 1];

      console.log(currentLastCard)

      deleteCard(currentLastCard);


      
      i--;

    }

  }
}

function getTime(){
  let time = new Date(Date.now()).toTimeString().substring(0, 8);
  return(time);
}
