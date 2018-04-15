/*
 * Create a list that holds all of your cards
 */
const deck = document.querySelector(".deck");
const stars = document.querySelector(".stars");
const restartButton = document.querySelector(".restart");
const symbols = ["fa fa-diamond", "fa fa-paper-plane-o", "fa fa-anchor", "fa fa-bolt",
                 "fa fa-cube", "fa fa-anchor", "fa fa-leaf", "fa fa-bicycle",
                 "fa fa-diamond", "fa fa-bomb", "fa fa-leaf", "fa fa-bomb",
                 "fa fa-bolt", "fa fa-bicycle", "fa fa-paper-plane-o", "fa fa-cube"]
const fragment = document.createDocumentFragment();
const numberOfMoves = document.querySelector(".moves");
const container = document.querySelector(".container");
let paragraph = document.createElement("p");
let openList = [];
let moveCounter = 0;
let cards = [];
/*
* Display the cards on the page
*   - shuffle the list of cards using the provided "shuffle" method below
*   - loop through each card and create its HTML
*   - add each card's HTML to the page
*/

function startGame() {
  container.className = 'container';
  paragraph.remove();
  moveCounter = 0;
  cards = [];
  openList = [];
  deck.innerHTML = "";
  numberOfMoves.innerHTML = moveCounter;
  stars.children[0].removeAttribute("style");
  stars.children[1].removeAttribute("style");
  for (let i = 0; i < symbols.length; i++) {
    const listItem = document.createElement('li');
    const symbol = document.createElement('i');
    listItem.className = 'card';
    symbol.className = symbols[i];
    listItem.appendChild(symbol);
    cards.push(listItem);
  }

  const shuffledCards = shuffle(cards);
  for (let i = 0; i < shuffledCards.length; i++) {
    fragment.appendChild(shuffledCards[i]);
  }
  deck.appendChild(fragment);
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
  }
  return array;
}

startGame();

/*
* set up the event listener for a card. If a card is clicked:
*  - display the card's symbol (put this functionality in another function that you call from this one)
*  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
*  - if the list already has another card, check to see if the two cards match
*    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
*    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
*    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
*    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
*/

function cardClicked(evt) {
 openCard(evt);
 updateStars();
 console.log(document.getElementsByClassName("match").length + " " + deck.childElementCount);
 if (document.getElementsByClassName("match").length + 1 === deck.childElementCount) {
   finalScore(moveCounter);
 }
}

function openCard(evt) {
 if (evt.target.className === "card") {
   evt.target.classList.add("open", "show")
   addCardToOpenList(evt);
 }
}

function addCardToOpenList(evt) {
 openList.push(evt.target);
 if (openList.length === 2) {
   if (openList[0].firstElementChild.className === openList[1].firstElementChild.className) {
     matchCards(openList);
   } else {
     setTimeout(hideCards, 550, openList);
   }
   openList = [];
   displayMoves(++moveCounter);
 }
}

function matchCards(openList) {
 openList[0].classList.remove("open", "show");
 openList[0].classList.add("match");
 setTimeout(function() {
   openList[1].classList.remove("open", "show");
   openList[1].classList.add("match");
  }, 501);
}

function hideCards(openList) {
 openList[0].style.background = "#e40242";
 openList[1].style.background = "#e40242";
 setTimeout(function() {
   openList[0].classList.remove("open", "show");
   openList[1].classList.remove("open", "show");
   openList[0].removeAttribute("style");
   openList[1].removeAttribute("style");
 }, 700);
}

function displayMoves(counter) {
  numberOfMoves.textContent = counter;
}

function updateStars() {
  if (moveCounter === 17) {
    stars.children[0].style.visibility = 'hidden';
  }
  if (moveCounter === 23) {
    stars.children[1].style.visibility = 'hidden';
  }
}

function finalScore(counter) {
  let numberOfStars = stars.childElementCount;
  if (counter > 15) {
    numberOfStars--;
    if (counter > 22) {
      numberOfStars--;
    }
  }
  paragraph = document.createElement("p");
  paragraph.innerHTML = `Congratulations you've won! with ${counter} moves for a total of ${numberOfStars}
   stars<br/><a href="#" onclick="startGame(); return false;">Play Again</a>`;
  container.setAttribute('style', 'transform: rotateY(360deg); transition: .5s;');
  setTimeout(function() {
    container.classList.toggle("hide");
    paragraph.setAttribute('style', 'z-index: 1;');
    document.body.appendChild(paragraph);
  }, 1000);
}

deck.addEventListener('click', cardClicked);
restartButton.addEventListener('click', startGame);
