import {
  getWordOfTheDay,
  checkWordExistence,
  postScore,
  getAverageScore,
} from "../js/Api.js";
import { auth } from "./Login.js";

const pageType = {
  LOGIN: "login",
  MAIN: "main",
  GAME: "game",
  STATS: "stats",
};

const state = {
  page: pageType.LOGIN,
  grid: new Array(),
  datasetState: new Array(),
  keyboard: new Array(),
  targetWord: ''
};

let word;
let targetWord;
let guessCount = 0;

const dictionary = [
  "aback",
  "abase",
  "abate",
  "abbey",
  "abbot",
  "abhor",
  "abide",
  "abled",
  "hello",
  "taste",
  "venom",
];

let gameGrid;
let alertContainer;
let keyboard;

//constants
const MAX_WORD_LENGTH = 5;
const FLIP_DURATION = 500;
const DANCE_DURATION = 500;

export function startGame() {
  checkLocalStorageForState();
  gameGrid = document.querySelector("[data-grid]");
  alertContainer = document.querySelector("[data-alert-container]");
  keyboard = document.querySelector("[data-keyboard]");
  document.addEventListener("click", mouseClickHandler);
  document.addEventListener("keydown", keyPressHandler);
}

async function checkWord() {
  if(state.targetWord == ''){
    word = await getWordOfTheDay();
  } else {
    word = state.targetWord;
  }
  targetWord = word.toLowerCase();
  state.targetWord = targetWord;
  updateSessionStorage();

  guessCount = 0;
  if (word === 401) {
    showAlert("Something went wrong!");
    endGame();
  } else {
    startGame();
  }
}

function checkLocalStorageForState() {
  let localState = sessionStorage.getItem("state");
  if (localState) {
    localState = JSON.parse(localState);
    state.page = localState.page;
    state.grid = localState.grid;
    state.datasetState = localState.datasetState;
    state.keyboard = localState.keyboard;
    state.targetWord = localState.targetWord;
    updateSessionStorage();
  }
}

function endGame() {
  document.removeEventListener("click", mouseClickHandler);
  document.removeEventListener("keydown", keyPressHandler);
}

function mouseClickHandler(e) {
  if (e.target.matches("[keyboard-key]")) {
    pressKey(e.target.textContent); //we do this way because it no work other way
    return;
  }

  if (e.target.matches("[keyboard-Enter]")) {
    submitGuess();
    return;
  }

  if (e.target.matches("[keyboard-Delete]")) {
    deleteKey();
    return;
  }
}

function keyPressHandler(e) {
  if (e.key == "Enter") {
    submitGuess();
    return;
  }

  if (e.key == "Delete" || e.key == "Backspace") {
    deleteKey();
    return;
  }

  if (e.key.match(/^[a-z]$/)) {
    pressKey(e.key);
    return;
  }
}

function pressKey(key) {
  const activeTiles = getActiveTiles();

  if (activeTiles.length >= MAX_WORD_LENGTH) return;

  const nextTile = gameGrid.querySelector(":not([data-letter])"); //get the first next tile that doesnt have a letter

  nextTile.dataset.letter = key.toLowerCase();
  nextTile.textContent = key;
  nextTile.dataset.state = "active";
  state.grid.push(key.toLowerCase());
  state.datasetState.push("active");
  updateSessionStorage();
}

function deleteKey() {
  const activeTiles = getActiveTiles();
  let lastTile = activeTiles[activeTiles.length - 1];
  if (lastTile == null) return;
  lastTile.textContent = "";
  delete lastTile.dataset.state;
  delete lastTile.dataset.letter;
  state.grid.pop();
  state.datasetState.pop();
  updateSessionStorage();
}

async function submitGuess() {
  guessCount += 1;
  let activeTiles = [...getActiveTiles()];
  if (activeTiles.length != MAX_WORD_LENGTH) {
    showAlert("Word is not long enough!", 1000);
    //play animation for tiles
    shakeAnimation(activeTiles);
    return;
  }

  let guessedWord = activeTiles.reduce((word, tile) => {
    return word + tile.dataset.letter;
  }, "");

  if (guessedWord !== targetWord) {
    let checkWord = await checkWordExistence(guessedWord.toLowerCase());

    if (checkWord === 404) {
      showAlert("Not a word!", 1000);
      shakeAnimation(activeTiles);
      return;
    }
  }

  endGame();

  activeTiles.forEach((...params) => flipTiles(...params, guessedWord));
}

function getActiveTiles() {
  return gameGrid.querySelectorAll('[data-state="active"]');
}

function checkWinState(guessedWord, array) {
  if (guessedWord === targetWord) {
    //win
    showAlert("You won!");
    danceAnimation(array);
    endGame();
    sessionStorage.setItem("score", guessCount);
    postScore(guessCount);
    setTimeout(() => {
      state.page = pageType.STATS;
      switchScreens();
    }, 2000);
    return;
  }

  const remainingTiles = gameGrid.querySelectorAll(":not([data-letter])");
  if (remainingTiles.length === 0) {
    showAlert("The word was " + targetWord.toUpperCase(), null);
    sessionStorage.setItem("score", 7);
    postScore(7);
    endGame();
    setTimeout(() => {
      state.page = pageType.STATS;
      switchScreens();
    }, 2000);
  }
}

//Animations\\
function shakeAnimation(tiles) {
  tiles.forEach((tile) => {
    tile.classList.add("shake");
    tile.addEventListener(
      "animationend",
      () => {
        tile.classList.remove("shake");
      },
      { once: true }
    );
  });
}

function setKeyboardFromState() {
  keyboard = document.querySelector("[data-keyboard]");
  state.keyboard.forEach((key) => {
    const onScreenKey = keyboard.querySelector(
      `[keyboard-key="${key.letter}"i]`
    );
    onScreenKey.classList.add(key.state);
  });
}

function flipTiles(tile, index, array, guessedWord) {
  let letter = tile.dataset.letter;
  const key = keyboard.querySelector(`[keyboard-key="${letter}"i]`);

  setTimeout(() => {
    tile.classList.add("flip");
  }, (index * FLIP_DURATION) / 2);

  tile.addEventListener(
    "transitionend",
    () => {
      tile.classList.remove("flip");

      if (targetWord[index] == letter) {
        //letter is in the correct location
        tile.dataset.state = "right";
        key.classList.add("right");
        state.keyboard.push({ letter: letter, state: "right" });
      } else if (targetWord.includes(letter)) {
        tile.dataset.state = "wrong-location";
        key.classList.add("wrong-location");
        state.keyboard.push({ letter: letter, state: "wrong-location" });
      } else {
        tile.dataset.state = "wrong";
        key.classList.add("wrong");
        state.keyboard.push({ letter: letter, state: "wrong" });
      }

      if (index === 0)
        state.datasetState[state.datasetState.length - 5] = tile.dataset.state;
      else
        state.datasetState[state.datasetState.length - (5 - index)] =
          tile.dataset.state;
      updateSessionStorage();

      if (index === array.length - 1) {
        tile.addEventListener(
          "transitionend",
          () => {
            startGame();
            checkWinState(guessedWord, array);
          },
          { once: true }
        );
      }
    },
    { once: true }
  );
}

function danceAnimation(tiles) {
  tiles.forEach((tile, index) => {
    setTimeout(() => {
      tile.classList.add("dance");
      tile.addEventListener(
        "animationend",
        () => {
          tile.classList.remove("dance");
        },
        { once: true }
      );
    }, (index * DANCE_DURATION) / 5);
  });
}

function showAlert(message, duration) {
  const alert = document.createElement("span");
  alert.textContent = message;
  alert.classList.add("alert");
  alertContainer.prepend(alert);

  if (duration != null) {
    setTimeout(() => {
      alert.classList.add("hide");
      alert.addEventListener("transitionend", () => {
        alert.remove();
      });
    }, duration);
  }
}

function drawHeading() {
  const title = document.querySelector(".title");
  title.classList.remove("stats");
  title.classList.remove('game');

  let badSpiders = document.querySelectorAll(".spirdle");
  badSpiders.forEach((badSpider) => {
    badSpider.classList.remove("game");
  });

  const welcome = document.createElement("section");
  welcome.className = "home";
  let words = [
    { letter: "W", color: "green" },
    { letter: "E", color: "yellow" },
    { letter: "L", color: "red" },
    { letter: "C", color: "green" },
    { letter: "O", color: "yellow" },
    { letter: "M", color: "red" },
    { letter: "E", color: "green" },
  ];
  makeWordContainer(welcome, words);
  title.appendChild(welcome);

  const to = document.createElement("section");
  to.className = "home";
  words = [
    { letter: "T", color: "red" },
    { letter: "O", color: "yellow" },
  ];
  makeWordContainer(to, words);
  title.appendChild(to);

  const spirdle = document.createElement("section");
  spirdle.className = "home bottom";
  words = [
    { letter: "S", color: "green" },
    { letter: "P", color: "yellow" },
    { letter: "I", color: "red" },
    { letter: "R", color: "green" },
    { letter: "D", color: "yellow" },
    { letter: "L", color: "red" },
    { letter: "E", color: "green" },
  ];
  makeWordContainer(spirdle, words);
  title.appendChild(spirdle);

  if (state.page === pageType.MAIN) {
    let playButton = document.createElement("button");
    playButton.className = "show button green";
    playButton.innerText = "How to Play";
    title.appendChild(playButton);
    const modal = document.createElement("dialog");
    modal.className = "modal";
    modal.id = "dialog";
    buildModal(modal);
    title.appendChild(modal);
    setupEventListenersForDialog();
    setupButtonEventListener(playButton);

    playButton = document.createElement("button");
    playButton.className = "button red";
    playButton.innerText = "Play";
    title.appendChild(playButton);
    setupButtonEventListener(playButton, pageType.GAME, switchScreens);
  } else {
    //assume pageType is LOGIN
    const loginButton = document.createElement("button");
    loginButton.className = "button red";
    loginButton.innerText = "Login";
    title.appendChild(loginButton);
    setupButtonEventListener(loginButton, pageType.MAIN, doAuth);
  }
}

async function doAuth() {
  state.page = pageType.MAIN;
  updateSessionStorage();
  await auth();
}

function makeWordContainer(container, words) {
  words.forEach((element) => {
    let sec = document.createElement("section");
    sec.className = `headingtile ${element.color}`;
    sec.innerText = element.letter;
    container.appendChild(sec);
  });
}

function setupButtonEventListener(
  btn,
  pageType = undefined,
  actionFunction = undefined
) {
  btn.addEventListener("click", function () {
    if (pageType !== undefined) {
      state.page = pageType;
      updateSessionStorage();
    }
    if (actionFunction !== undefined) {
      actionFunction();
    }
  });
}

function buildModal(container) {
  const order = document.createElement("section");
  order.className = "order";

  const how = document.createElement("section");
  how.className = "How";
  let words = [
    { letter: "H", color: "green" },
    { letter: "O", color: "red" },
    { letter: "W", color: "yellow" },
  ];
  makeModalContainer(how, words);
  order.appendChild(how);

  const to = document.createElement("section");
  to.className = "To";
  words = [
    { letter: "T", color: "green" },
    { letter: "O", color: "red" },
  ];
  makeModalContainer(to, words);
  order.appendChild(to);

  const play = document.createElement("section");
  play.className = "play";
  words = [
    { letter: "P", color: "yellow" },
    { letter: "L", color: "green" },
    { letter: "A", color: "red" },
    { letter: "Y", color: "yellow" },
  ];
  makeModalContainer(play, words);
  order.appendChild(play);
  container.appendChild(order);

  let paragraph = document.createElement("p");
  paragraph.innerText =
    "Welcome to Spirdle, where words weave tales of mystery and discovery. Imagine yourself embarking on an adventure, seeking to uncover a hidden secret—a five-letter word waiting to be revealed.";
  container.appendChild(paragraph);
  paragraph = document.createElement("p");
  paragraph.innerText =
    "With each guess, you step closer to unraveling the puzzle. Pay attention to the clues provided—green letters show correct letters in the right place, while yellow hints at correct letters in the wrong spot. And if a letter doesn't belong, it appears gray.";
  container.appendChild(paragraph);
  paragraph = document.createElement("p");
  paragraph.innerText =
    "Piece by piece, refine your guesses, letting intuition guide you through the labyrinth of possibilities. Victory comes when the word is finally unveiled. But even if the mystery remains unsolved after six tries, remember, every attempt is a step towards understanding.";
  container.appendChild(paragraph);
  paragraph = document.createElement("p");
  paragraph.innerText =
    "Ready to delve into the world of Spirdle? Let the adventure begin, and may the words lead you to triumph!";
  container.appendChild(paragraph);

  let sec = document.createElement("section");
  sec.className = "sticky";

  const btn = document.createElement("button");
  btn.className = "close button-dialog red";
  btn.innerText = "All done";
  sec.appendChild(btn);
  container.appendChild(sec);
}

function makeModalContainer(container, words) {
  words.forEach((element) => {
    let sec = document.createElement("section");
    sec.className = `htptile htp ${element.color}`;
    sec.innerText = element.letter;
    container.appendChild(sec);
  });
}

function buildStats() {
  const title = document.querySelector(".title");
  title.classList.remove("game");
  title.classList.add("stats");
  
  let badSpiders = document.querySelectorAll(".spirdle");
  badSpiders.forEach((badSpider) => {
    badSpider.classList.add("game");
  });

  document.body.style.removeProperty("background-image");

  const titleStats = document.createElement("section");
  titleStats.id = "title-stats";
  buildTitleStats(titleStats);
  title.appendChild(titleStats);

  const card = document.createElement("section");
  card.className = "card";
  buildCard(card);
  title.appendChild(card);

  const sec = document.createElement("section");
  const btn = document.createElement("button");
  btn.className = "button-stats button green";
  btn.innerText = "Go Home";
  sec.appendChild(btn);
  title.appendChild(sec);
  setupButtonEventListener(btn, pageType.MAIN, switchScreens);
  clearState();
}

function clearState(){
  state.grid = new Array();
  state.datasetState = new Array();
  state.keyboard = new Array();
  state.targetWord = "";
  updateSessionStorage();
}

function buildTitleStats(container) {
  const well = document.createElement("section");
  well.className = "well";
  let words = [
    { letter: "W", color: "green" },
    { letter: "E", color: "red" },
    { letter: "L", color: "yellow" },
    { letter: "L", color: "green" },
  ];
  makeStatsContainer(well, words);
  container.appendChild(well);

  const done = document.createElement("section");
  done.className = "done";
  words = [
    { letter: "D", color: "red" },
    { letter: "O", color: "yellow" },
    { letter: "N", color: "green" },
    { letter: "E", color: "red" },
  ];
  makeStatsContainer(done, words);
  container.appendChild(done);
}
async function buildCard(container) {
  const statData = await getStats();
  makePTag(container, "no-margin", "The word is:");
  makePTag(container, "headingtile green stats-tile", statData.word);
  makePTag(container, "no-margin", "Your score is:");
  makePTag(container, "headingtile stats-tile red", statData.score);
  makePTag(container, "no-margin", "The average score: ");
  makePTag(container, "headingtile stats-tile yellow", statData.averageScore);
}
function makePTag(container, className, content) {
  let pTag = document.createElement("p");
  pTag.className = className;
  pTag.innerText = content;
  container.appendChild(pTag);
}

function makeStatsContainer(container, words) {
  words.forEach((element) => {
    let sec = document.createElement("p");
    sec.className = `statstile ${element.color}`;
    sec.innerText = element.letter;
    container.appendChild(sec);
  });
}

function setupEventListenersForDialog() {
  const dialogElement = document.getElementById("dialog");
  const showBtn = document.querySelector(".show");
  const closeBtn = document.querySelector(".close");

  showBtn.addEventListener("click", () => {
    dialogElement.showModal();
  });

  closeBtn.addEventListener("click", () => {
    dialogElement.close();
  });
}

function clearElementInternals(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

function buildGame() {
  let badSpiders = document.querySelectorAll(".spirdle");
  badSpiders.forEach((badSpider) => {
    badSpider.classList.add("game");
  });

  document.body.style.backgroundImage =
    "url('../../img/game_background_repeat.png')";

  const title = document.querySelector(".title");
  title.classList.add("game");
  const alertContainer = document.createElement("section");
  alertContainer.className = "alert-container";
  alertContainer.dataset.alertContainer = "";
  title.appendChild(alertContainer);

  const grid = document.createElement("section");
  grid.dataset.grid = "";
  grid.className = "grid";
  makeBoard(grid);
  title.appendChild(grid);

  const keyboardContainer = document.createElement("section");
  keyboardContainer.dataset.keyboard = "";
  keyboardContainer.className = "Keyboard";
  makeKeyboard(keyboardContainer);
  title.appendChild(keyboardContainer);
  setKeyboardFromState();

  checkWord();
}

function makeBoard(container) {
  for (let i = 0; i < 30; i++) {
    let sec = document.createElement("section");
    sec.className = "tile";
    if (i === 0) sec.dataset.stateWrong = "";

    if (i < state.grid.length) {
      sec.innerText = state.grid[i];
      sec.dataset.letter = state.grid[i];
      sec.dataset.state = state.datasetState[i];
    }

    container.appendChild(sec);
  }
}

function makeKeyboard(container) {
  const lettersArray = [
    "Q",
    "W",
    "E",
    "R",
    "T",
    "Y",
    "U",
    "I",
    "O",
    "P",
    "",
    "A",
    "S",
    "D",
    "F",
    "G",
    "H",
    "J",
    "K",
    "L",
    "",
    "backspace",
    "Z",
    "X",
    "C",
    "V",
    "B",
    "N",
    "M",
    "enter",
  ];

  lettersArray.forEach((letter) => {
    let element;
    switch (letter) {
      case "":
        element = document.createElement("section");
        element.className = "space";
        break;
      case "enter":
        element = document.createElement("button");
        element.setAttribute("keyboard-Enter", "");
        element.className = "Key large";
        element.innerText = "Enter";
        break;
      case "backspace":
        element = document.createElement("button");
        element.className = "Key large material-symbols-outlined";
        element.setAttribute("keyboard-Delete", "");
        element.innerText = "DEL";
        break;
      default:
        element = document.createElement("button");
        element.className = "Key";
        element.setAttribute("keyboard-key", letter);
        element.innerText = letter;
        break;
    }
    container.appendChild(element);
  });
}

function switchScreens() {
  const title = document.querySelector(".title");
  clearElementInternals(title);
  setupScreen();
}

function setupScreen() {
  switch (state.page) {
    case pageType.LOGIN:
    case pageType.MAIN:
      drawHeading();
      break;
    case pageType.GAME:
      buildGame();
      break;
    case pageType.STATS:
      buildStats();
      break;
  }
}

function updateSessionStorage() {
  // sessionStorage.clear();
  sessionStorage.setItem("state", JSON.stringify(state));
}

async function getStats() {
  let word = sessionStorage.getItem("word");
  let score = sessionStorage.getItem("score");
  let averageScore = parseInt(await getAverageScore());

  if (score == 7) {
    score = "DNF";
  }

  if (averageScore == 7) {
    averageScore = "@all DNF";
  }

  let statData = {
    word,
    score,
    averageScore,
  };

  return statData;
}

checkLocalStorageForState();
setupScreen();
