const dictionary = [
    "testy",
    "hello",
    "slipe",
    "slice",
    "hours",
]


const gameGrid = document.querySelector("[data-grid]");
const alertContainer = document.querySelector("[data-alert-container]");
const keyboard = document.querySelector("[data-keyboard]");

//constants 
const MAX_WORD_LENGTH = 5;
const FLIP_DURATION = 500;
const DANCE_DURATION = 500;


let targetWord = "hello"; //the word they need to guess 


startGame();

function startGame(){
    document.addEventListener("click", mouseClickHandler);
    document.addEventListener("keydown", keyPressHandler);
}

function endGame(){
    document.removeEventListener("click", mouseClickHandler);
    document.removeEventListener("keydown", keyPressHandler);
}

function mouseClickHandler(e){
    if(e.target.matches("[keyboard-key]")){
        pressKey(e.target.dataset.key);
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

function submitGuess(){
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
    const key = keyboard.querySelector(`[keyboard-key="${letter}"i]`)

    setTimeout(() =>{
        tile.classList.add("flip");
    }, index * FLIP_DURATION / 2);

    tile.addEventListener("transitionend", () => {
        tile.classList.remove("flip");

        if(targetWord[index] == letter){ //letter is in the correct location 
            tile.dataset.state = "right"
            key.classList.add("right");

        }else if(targetWord.includes(letter)){
            tile.dataset.state = "wrong-location"
            key.classList.add("wrong-location");
        }else{
            tile.dataset.state = "wrong"
            key.classList.add("wrong");
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