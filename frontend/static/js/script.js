


const pageType = {
    LOGIN: 'login',
    MAIN: 'main',
    GAME: 'game',
    STATS: 'stats'
};

const state = {
    page: pageType.LOGIN
};





let word = 'abate';
let targetWord = word.toLowerCase();
console.log(targetWord);
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
    "venom"
]

let gameGrid;
let alertContainer;
let keyboard;

//constants 
const MAX_WORD_LENGTH = 5;
const FLIP_DURATION = 500;
const DANCE_DURATION = 500;

//let targetWord = worldeWord.toLowerCase(); //the word they need to guess 

// startGame();

export function startGame(){
    gameGrid = document.querySelector("[data-grid]");
    alertContainer = document.querySelector("[data-alert-container]");
    keyboard = document.querySelector("[data-keyboard]");
    document.addEventListener("click", mouseClickHandler);
    document.addEventListener("keydown", keyPressHandler);
}

function endGame(){
    document.removeEventListener("click", mouseClickHandler);
    document.removeEventListener("keydown", keyPressHandler);
}

function mouseClickHandler(e){
    if(e.target.matches("[keyboard-key]")){
        pressKey(e.target.textContent); //we do this way because it no work other way 
        return
    }

    if(e.target.matches("[keyboard-Enter]")){
        submitGuess();
        return
    }

    if(e.target.matches("[keyboard-Delete]")){
        deleteKey();
        return
    }
}

function keyPressHandler(e){
    if(e.key == "Enter"){
        submitGuess();
        return
    }

    if(e.key == "Delete" || e.key == "Backspace"){
        deleteKey();
        return
    }

    if(e.key.match(/^[a-z]$/)){
        pressKey(e.key);
        return
    }
}

function pressKey(key){
    const activeTiles = getActiveTiles();

    if(activeTiles.length >= MAX_WORD_LENGTH) return;

    const nextTile = gameGrid.querySelector(":not([data-letter])"); //get the first next tile that doesnt have a letter
    
    nextTile.dataset.letter = key.toLowerCase();
    nextTile.textContent = key; 
    nextTile.dataset.state = "active"; 

}

function deleteKey(){
    const activeTiles = getActiveTiles();
    let lastTile = activeTiles[activeTiles.length -1];
    if(lastTile == null) return;
    lastTile.textContent = "";
    delete lastTile.dataset.state;
    delete lastTile.dataset.letter;
}

async function submitGuess(){
    guessCount += 1;
    let activeTiles = [...getActiveTiles()];
    if(activeTiles.length != MAX_WORD_LENGTH){
        showAlert("Word is not long enough!", 1000);
        //play animation for tiles 
        shakeAnimation(activeTiles);
        return
    }

    let guessedWord = activeTiles.reduce((word, tile) => {
        return word + tile.dataset.letter;

    }, "")

    if(!dictionary.includes(guessedWord)){
        showAlert("Not a word!", 1000);
        shakeAnimation(activeTiles);
        return
    }

    // let checkWord = await checkWordExistence(guessedWord.toLowerCase());
    // console.log(checkWord);

    // if(checkWord === 404){
    //     console.log("WORD does not exists!");
    //     showAlert("Not a word!", 1000);
    //     shakeAnimation(activeTiles);
    //     return;
    // }


    endGame();

    activeTiles.forEach((...params) => flipTiles(...params, guessedWord))
    
}

function getActiveTiles(){
    return gameGrid.querySelectorAll('[data-state="active"]');

}

function checkWinState(guessedWord, array){
    if(guessedWord === targetWord){
        //win 
        showAlert("You won!");
        danceAnimation(array);
        endGame();
        console.log("guess score is: " + guessCount);
        return
    }

    const remainingTiles = gameGrid.querySelectorAll(":not([data-letter])")
    if (remainingTiles.length === 0) {
        showAlert("The word was " + targetWord.toUpperCase() , null);
        endGame();
    }


}

//Animations\\
function shakeAnimation(tiles){
    tiles.forEach(tile => {
        tile.classList.add("shake");
        tile.addEventListener("animationend", () => {
            tile.classList.remove("shake");
        }, { once: true })
    });
}

function flipTiles(tile, index, array, guessedWord){
    let letter = tile.dataset.letter;
    // const key = keyboard.querySelector(`[keyboard-key="${letter}"i]`)

    setTimeout(() =>{
        tile.classList.add("flip");
    }, index * FLIP_DURATION / 2);

    tile.addEventListener("transitionend", () => {
        tile.classList.remove("flip");

        if(targetWord[index] == letter){ //letter is in the correct location 
            tile.dataset.state = "right"
            // key.classList.add("right");

        }else if(targetWord.includes(letter)){
            tile.dataset.state = "wrong-location"
            // key.classList.add("wrong-location");
        }else{
            tile.dataset.state = "wrong"
            // key.classList.add("wrong");
        }

        if(index === array.length -1){
            tile.addEventListener("transitionend", () =>{
                startGame();
                checkWinState(guessedWord, array);
            }, { once: true })
            
        }
    }, { once: true })
}

function danceAnimation(tiles){
    tiles.forEach((tile, index) => {
        setTimeout(() => {
          tile.classList.add("dance")
          tile.addEventListener(
            "animationend",
            () => {
              tile.classList.remove("dance")
            },
            { once: true }
          )
        }, (index * DANCE_DURATION) / 5)
      })

}

function saveScore(){
    // postScore(score);
}

function showAlert(message, duration){
    const alert = document.createElement("span");
    alert.textContent = message;
    alert.classList.add("alert");
    alertContainer.prepend(alert);

    if(duration != null){
        setTimeout(() =>{
            alert.classList.add("hide");
            alert.addEventListener("transitionend", () => {
                alert.remove();
            })

        }, duration)
    }

}









function drawHeading(){
    const title = document.getElementById('title');

    const welcome = document.createElement('section');
    welcome.className = 'home';
    let words = [
        {letter: "W", color: 'green'},
        {letter: "E", color: 'yellow'},
        {letter: "L", color: 'red'},
        {letter: "C", color: 'green'},
        {letter: "O", color: 'yellow'},
        {letter: "M", color: 'red'},
        {letter: "E", color: 'green'}
    ];
    makeWordContainer(welcome, words);
    title.appendChild(welcome);

    const to = document.createElement('section');
    to.className = 'home';
    words = [
        {letter: "T", color: 'red'},
        {letter: "O", color: 'yellow'}
    ];
    makeWordContainer(to, words);
    title.appendChild(to);

    const spirdle = document.createElement('section');
    spirdle.className = 'home';
    words = [
        {letter: "S", color: 'green'},
        {letter: "P", color: 'yellow'},
        {letter: "I", color: 'red'},
        {letter: "R", color: 'green'},
        {letter: "D", color: 'yellow'},
        {letter: "L", color: 'red'},
        {letter: "E", color: 'green'}
    ];
    makeWordContainer(spirdle, words);
    title.appendChild(spirdle);

    if(state.page === pageType.MAIN){
        let playButton = document.createElement('button');
        playButton.className = "home-button button show";
        playButton.innerText = 'How to Play';
        title.appendChild(playButton);
        setupButtonEventListener(playButton, undefined, setupEventListenersForDialog);

        playButton = document.createElement('button');
        playButton.className = "home-button button";
        playButton.innerText = 'Play';
        title.appendChild(playButton);
        setupButtonEventListener(playButton, pageType.GAME, switchScreens);

    } else { //assume pageType is LOGIN
        const loginButton = document.createElement('button');
        loginButton.className = "button";
        loginButton.role = 'button';
        loginButton.id = 'login';
        loginButton.innerText = 'Login';
        title.appendChild(loginButton);
        setupButtonEventListener(loginButton, pageType.MAIN, switchScreens);
    }
}

function makeWordContainer(container, words){
    words.forEach(element => {
        let sec = document.createElement('section');
        sec.className = `headingtile ${element.color}`;
        sec.innerText = element.letter;
        container.appendChild(sec);
    });
}

function setupButtonEventListener(btn, pageType = undefined, actionFunction = undefined) {
    btn.addEventListener('click', function() {
        if(pageType !== undefined){
            state.page = pageType;
        }
        if (actionFunction !== undefined) {
            actionFunction();
        }
    });
}

function buildModal(){

}

function setupEventListenersForDialog(){
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

function clearElementInternals(element){
    while(element.firstChild){
        element.removeChild(element.firstChild);
    }
}

function buildGame(){
    const title = document.querySelector('#title');
    const alertContainer = document.createElement('section');
    alertContainer.className = "alert-container";
    alertContainer.dataset.alertContainer = '';
    title.appendChild(alertContainer);

    const grid = document.createElement('section');
    grid.dataset.grid = '';
    grid.className = 'grid';
    makeBoard(grid);
    title.appendChild(grid);

    startGame();
}

function makeBoard(container){
    for(let i = 0; i < 30; i++){
      let sec = document.createElement('span');
      sec.className = 'tile';
      if(i===0) sec.dataset.stateWrong = '';
      container.appendChild(sec);
    }
  }


function switchScreens(){
    const title = document.getElementById('title');
    clearElementInternals(title);
    setupScreen();
}

function setupScreen(){
    switch(state.page){
        case pageType.LOGIN:
        case pageType.MAIN:
            drawHeading();
            break;
        case pageType.GAME:
            buildGame();
            break;
        case pageType.STATS:
            break;
    }
}

setupScreen();