import physicistObj from "./data/physicistDesc.js";

let maxNumOfCards = 3;

// Copy the template card and store it globally so it may be accessed at any point (as opposed to have it in the DOM)
const templateCard = document.querySelector(".card");

// This calls the addCards() function when the page is first loaded
document.addEventListener("DOMContentLoaded", () => {

  // gets all the card DOM elements
  const allCards = document.querySelector("#card-container").children;

  // creates initial set of cards
  createCards(physicistObj, maxNumOfCards);

  // adjusts site to screen size at load to prevent cutoffs
  const windowWidth = window.innerWidth;
  adjustToScreenSize(windowWidth);

  const currentNumOfCards = allCards.length;
  console.log(currentNumOfCards, allCards);

  // stores the time the site was loaded for THE SECRET
  updateTime();
  
});

// listens for resize and checks to see if a new sizing limit was reached
window.addEventListener("resize", (evt) => {

  const windowWidth = evt.target.innerWidth;
  adjustToScreenSize(windowWidth);

});

// This function adds cards the page to display the data in the array
function createCards(dataObj, amount, startIndex=0) {

  const cardContainer = document.getElementById("card-container");

  // reset the DOM since we already have a copy of template card
  cardContainer.innerHTML = "";

  // Grabs all the keys in the object and returns in array form
  const physicistNames = Object.keys(dataObj);

  // Update the UI element in the bottom right corner with the proper amount of physicists in the data object
  document.querySelector(".totalNumberOfCards").textContent = physicistNames.length;
  document.querySelector(".numberOfCollected").textContent = amount;
  
  // Generate cards for amount times (generally stored in the maxNumOfCards variable)
  for (let i = 0; i < amount; i++) {

    // name of physicist
    const physicist = physicistNames[i];

    // The object associated with each physicist's name
    const physicistInfo = dataObj[physicist];

    // clone the template card
    const nextCard = templateCard.cloneNode(true);
    nextCard.id = `card${i + startIndex}`;

    // Edit title and image
    editCardContent(nextCard, physicist, physicistInfo);

    // Add new card to the container
    cardContainer.appendChild(nextCard);
  }
}

function editCardContent(card, newName, physicistInfo) {


  // Change from display: none to display: flex
  card.style.display = "flex";

  // Indicate that the card is currently being displayed
  physicistInfo["Visible"] = "true";

  // Name of physicist (which is the header)
  card.physicist = newName;
  const cardHeader = card.querySelector("h2");
  cardHeader.textContent = newName;


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
  

  // Picture of physicist along with an alt description
  const image = physicistInfo["Image"];
  const cardImage = card.querySelector("img");
  cardImage.src = image;
  cardImage.alt = "Image of " + newName;

  // Stores whether the card has been collecting according to the physicist's Collected property
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
  // Only adds the replace function if it does not already exist on the card
  const cardhasReplaceFn = card.replaceFn;

  if (!cardhasReplaceFn) {

    // add click event listener
    replaceButton.addEventListener("click", () => {
      
      // replace current card and generate new one with random physicist
      replaceCard(card, physicistObj);
      
      // Since we are removing the current physicist form the page, we want to ensure it is marked as invisible
      physicistInfo["Visible"] = "false";
  
    });

    card.replaceFn = true;

  }
  
  // Event listener for delete card button
  // Only adds the delete function if it does not already exist on the card
  const deleteButton = card.querySelector(".deleteButton");
  const cardHasDeleteFn = card.deleteFn;

  if (!cardHasDeleteFn) {

    // add click event listener
    deleteButton.addEventListener("click", () => {
      
      // remove card from DOM
      deleteCard(card);
      
      // Since we are removing the current physicist form the page, we want to ensure it is marked as invisible
      physicistInfo["Visible"] = "false";
  

  
    });

    card.deleteFn = true;

  }

  const cardContent = card.querySelector(".card-content");

  // displays a pop-up and mroe info when the user clicks inside of the physicist's card
  cardContent.addEventListener("click", () => {

    displayDesc(physicistInfo, newName);

  });



  // This shows the delete/replace options on each card on hover
  card.addEventListener("mouseenter", toggleCardOptions);

  // This hides the delete/replace options on each card on un-hover
  card.addEventListener("mouseleave", toggleCardOptions);

}

function toggleCardOptions(evt) {

  // type of event (such as "click")
  const eventType = evt.type;

  const card = evt.target;

  const cardContent = card.querySelector(".card-content");

  const dropdown = card.querySelector(".cardDropdown");

  // essentially, if the mouse enters the card we reveal the options, otheriwse (such as in "mouseleave") we hide the options
  // data-toggle is an additional html attribute to prevent the use of more global variables and other complexities
  if (eventType == "mouseenter") {

    dropdown.setAttribute("data-toggle", "on");
    dropdown.style.transform = "scaleY(1)";
    
    // change border-radius for better design
    cardContent.style.borderRadius = "5px 5px 0 0";

    // set background text to currently focused physicist
    changeBackgroundText(card.physicist);

  } else {

    dropdown.setAttribute("data-toggle", "off");
    dropdown.style.transform = "scaleY(0)";

    // revert border-radius
    cardContent.style.borderRadius = "5px";

    // reset background text
    changeBackgroundText("");

  }

}

function replaceCard(oldCard, dataObj) {

  let randomPhysicistName;
  let newPhysicist;

  let physicistNames = Object.keys(dataObj);

  // Goes through and filters the array to see what physicists already have a card being displayed
  // In order to prevent iterating through all the physicists, we cannot increment when we find a "visible" physicist
  let i = 0;

  while (i < physicistNames.length) {

    const name = physicistNames[i];

    const physicistInfo = dataObj[name];

    if (physicistInfo["Visible"] == "true") {

      // get index of "visible" physicist
      const physicistIndex = physicistNames.indexOf(name);

      // remove physicist from the array of options
      physicistNames.splice(physicistIndex, 1);

    } else {

      i++;
    
    }
  }

  // grab the old physicist (the one being replaced) using the .physicist attribute assigned to all cards
  let oldPhysicist = dataObj[oldCard.physicist];

  // indicate invisibility
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

  // This is all "logic" for the secret (it's just a bunch of annoying alerts)
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

          finalDecision = fourthDecision;

        } else {

          return;

        }

      } else {

        return;

      }

    } else {

      return;

    }

    // If the final decision is true, queue THE BLACK HOLE
    if (finalDecision) {
      toggleAddCardButton(true);
      cardContainer.removeChild(card);
      secret();

      return;

    } else {

      return;

    }
    
  }

  // If after deletion there are less cards than the max available (default is 3 but is less for smaller screen sizes), reveals "Add Card" button
  // Otherwise, it will hide it if it is visible
  if (numOfCards <= maxNumOfCards) {

    toggleAddCardButton(false);

  } else {

    toggleAddCardButton(true);

  }

  // Removes the card from the site
  cardContainer.removeChild(card);


  // grab the physicist being deleting so we can indicate they are invisible
  const physicistBeingDeleted = physicistObj[card.physicist];

  physicistBeingDeleted["Visible"] = "false";

}

function addCard(evt) {

  const cardContainer = document.getElementById("card-container");
  const templateCard = document.querySelector(".card");

  let numOfCards = cardContainer.children.length;

  // Grabs all the keys in the object and returns in array form
  const physicistNames = Object.keys(physicistObj);

  // name of physicist
  const physicist = physicistNames[numOfCards];

  // The object associated with each physicist's name
  const physicistInfo = physicistObj[physicist];

  // create new clonw of template and provide it with a unique id
  const nextCard = templateCard.cloneNode(true);
  nextCard.id = `card${numOfCards}`;

  // Edit title and image
  editCardContent(nextCard, physicist, physicistInfo);

  // Add new card to the container
  cardContainer.appendChild(nextCard);

  // Done to prevent newly added cards from being duplicates
  replaceCard(nextCard, physicistObj); 

  const replacementPhysicist = physicistObj[nextCard.physicist];

  //replacementPhysicist["Visible"] = "true"

  // Checks to see if we have reached the max number of cards and removes the "Add Card" button if so
  // The number of cards prior to addition will also be the number appended to the new card
  // since the card numbers start from 0 (whereas length starts from 1)
  if (++numOfCards >= maxNumOfCards) {

    toggleAddCardButton(true);

  }

}

function toggleAddCardButton(hideButton) {

  const addCardButton = document.querySelector(".addCardButton");

  const isVisible = addCardButton.getAttribute("data-visible");

  // To prevent from hiding the button and then just revealing it afterwards (since it's visibility may already be "true")
  // We terminate the function at the end if hideButton == true
  if (hideButton) {

    addCardButton.style.transform = "scaleX(0) scaleY(0)";
    addCardButton.removeEventListener("click", addCard);

    addCardButton.setAttribute("data-visible", "false");

    return;

  }

  if (isVisible == "false") {

    addCardButton.style.transform = "scaleX(1) scaleY(1)";
    addCardButton.addEventListener("click", addCard);

    addCardButton.setAttribute("data-visible", "true");

  }

}

function changeBackgroundText(newName) {

  const backgroundText = document.querySelector(".backgroundText");

  // in order to account for physicists with multiple names, we replace spaces with html break tags for a smoother design
  const formattedName = newName.replace(" ", "<br>");

  // animation that adds a minimal fade for smoother appearance
  backgroundText.style.opacity = 0;
  
  setTimeout(() => {
    backgroundText.innerHTML = formattedName;
  }, 50);

  setTimeout(() => {
    backgroundText.style.opacity = 1;
  }, 50);
}

function displayDesc(physicistInfo, name) {

  // showOverlay returns the area in which the content will go
  const overlayContent = showOverlay();

  const imgSection = overlayContent.querySelector(".imgSection");

  // name of physicist
  const title = imgSection.querySelector(".physicistDescTitle");
  title.textContent = name;

  // image of physicist
  const img = imgSection.querySelector(".physicistDescImg");
  img.src = physicistInfo["Image"];

  // image of physicist, but it is blurred and applied to the overlay background
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
  
  // brief description of the physicist
  const descriptionSection = infoSection.querySelector(".physicistDesc");
  const description = physicistInfo["Description"];
  descriptionSection.textContent = description;

}

function showOverlay() {

  const overlay = document.querySelector(".overlay");
  const overlayProperties = overlay.style;

  // expand overlay and allow for it to be clicked on
  overlayProperties.transform = "scaleX(1) scaleY(1)";
  overlayProperties.pointerEvents = "all";

  const heroProperties = document.querySelector(".hero").style;

  // blur the main content to direct focus towards
  heroProperties.filter = "blur(4px)";

  // if anything outside of the overlay content, we hide the overlay
  window.addEventListener("click", hideOverlay);

  return overlay.querySelector(".overlayContent");

}

function hideOverlay(evt) {

  const overlay = document.querySelector(".overlay");
  const overlayProperties = overlay.style;

  const heroProperties = document.querySelector(".hero").style;

  // grab the object that was clicked
  const target = evt.target;

  // check if the object clicked is a descendant of the overlay
  const containsOverlay = target.contains(overlay);

  // reduce overlay and revoke its pointer events along with the blur
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

  // normal sizing is the defualt, unless the window is smaller
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

  // if the cuurent sizing and the newly calculated one are the same, nothing is done
  if (currentSizing == newSizing) {

    return;

  } else {

    hero.setAttribute("data-sizing", newSizing);
    console.log(`Size now ${newSizing}. Max Cards: ${maxNumOfCards}, Current Cards: ${currentNumOfCards}`);
    let i = currentNumOfCards;

    // hide the "Add Card" button if the cards on the page exceed or equal the max
    if (currentNumOfCards < maxNumOfCards) {
      
      toggleAddCardButton(false);

    } else {

      toggleAddCardButton(true);

    }

    // remove any cards above the limit of max cards
    while (i > maxNumOfCards) {

      const currentLastCard = allCards[i - 1];

      console.log(currentLastCard);

      deleteCard(currentLastCard);
      
      i--;

    }

  }
}

function updateTime(){
  // gets current time, converts to readable time string (hh:mm:ss) by chopping off the extra info (such as the date)
  let time = new Date(Date.now()).toTimeString().substring(0, 8);

  // stores the time the site was loaded for THE SECRET
  let blackHoleTime = document.querySelector(".blackHoleTime");
  blackHoleTime.textContent = time;
}

// Secret for the site
// After the user says yes to all four confirmations this replaces the background and brigns up a UI prompt to time travel
function secret() {

  // reset background text
  changeBackgroundText("");

  let background = document.querySelector(".background");

  // add site logo to the backgroudn
  background.style.backgroundImage = "url(AJourneyThroughPhysicsLogo.png)";

  let secret = document.querySelector(".secret");

  // show secret prompt and along user interaction with it
  secret.style.opacity = 1;
  secret.style.pointerEvents = "all";

  let blackHoleButton = secret.querySelector(".blackHoleButton");

  // Upon clicking the button, the user will be sent back in time to when they first loaded the site
  blackHoleButton.addEventListener("click", () => {

    updateTime();

    const physicistNames = Object.keys(physicistObj);

    // reset the status of collected and visible cards
    for (let i = 0; i < physicistNames.length; i++) {

      const physicistName = physicistNames[i];
      const physicist = physicistObj[physicistName];


      console.log(physicist);
        
      physicist["Collected"] = "false";
      physicist["Visible"] = "false";

    }

    // reset number of collected cards
    let numberOfCollectedDOM = document.querySelector(".numberOfCollected")
    
    // Gathers number of currently collected cards
    numberOfCollectedDOM.setAttribute("data-collected", 0);
    
    createCards(physicistObj, maxNumOfCards);
    console.log(maxNumOfCards);
    // remove logo from background
    background.style.backgroundImage = "";

    // hide the secret prompt and remove its interactables
    secret.style.opacity = 0;
    secret.style.pointerEvents = "none";

    

  });

}
