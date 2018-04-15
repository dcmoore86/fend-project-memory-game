/*
 * Declaration of variables
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
const timer = document.querySelector(".timer");
let paragraph = document.createElement("p");
let openList = [];
let moveCounter = 0;
let cards = [];
let startTimer;
let seconds = 0;

/* startGame() function add cards to the deck, shuffles the deck, and displays the
 cards on the page */

function startGame() {
  clearInterval(startTimer);
  paragraph.setAttribute('style', 'z-index: -1;');
  moveCounter = 0;
  seconds = 0;
  cards = [];
  openList = [];
  deck.innerHTML = "";
  timer.innerHTML = "";
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

/* Once a card is clicked it starts the timer, flips the cards, and determines
   whether cards are matched or unmatched. If all cards match the timer is stopped
   and the final score is shown in the modal */
function cardClicked(evt) {
  if (seconds === 0) {
    startTimer = setInterval(function() {
      timer.innerHTML = ++seconds;
    }, 1000);
  }
  openCard(evt);
  updateStars();
  console.log(document.getElementsByClassName("match").length + " " + deck.childElementCount);
  if (document.getElementsByClassName("match").length + 1 === deck.childElementCount) {
    clearInterval(startTimer);
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

//Sets the CSS if cards match
function matchCards(openList) {
 openList[0].classList.remove("open", "show");
 openList[0].classList.add("match");
 setTimeout(function() {
   openList[1].classList.remove("open", "show");
   openList[1].classList.add("match");
  }, 501);
}

//Sets the CSS if cards do not match
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

//Displays the number of moves the player has taken. 2 card clicks = 1 move
function displayMoves(counter) {
  numberOfMoves.textContent = counter;
}

//Removes (actually hides) stars as the number of moves increases
function updateStars() {
  if (moveCounter === 17) {
    stars.children[0].style.visibility = 'hidden';
  }
  if (moveCounter === 23) {
    stars.children[1].style.visibility = 'hidden';
  }
}

/* Sets up the modal to display all the winner information
(time taken to match all cards, number of stars, number of moves) */
function finalScore(counter) {
  let numberOfStars = stars.childElementCount;
  if (counter > 15) {
    numberOfStars--;
    if (counter > 22) {
      numberOfStars--;
    }
  }
  mins = Math.floor(seconds/60);
  secs = seconds % 60;
  paragraph = document.createElement("p");
  paragraph.innerHTML = `Congratulations you've won! It took you ${mins}m ${secs}s
  with ${counter} moves for a total of ${numberOfStars}
  stars<br/><a href="#" onclick="startGame(); return false;">Play Again</a>`;
  container.setAttribute('style', 'transform: rotateY(360deg); transition: .5s;');
  setTimeout(function() {
    document.body.appendChild(paragraph);
    paragraph.setAttribute('style', 'z-index: 1;');
  }, 1000);
}

deck.addEventListener('click', cardClicked);
restartButton.addEventListener('click', startGame);
