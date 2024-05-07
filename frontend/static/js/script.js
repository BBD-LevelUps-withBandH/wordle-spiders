import Dashboard from "./views/Dashboard.js";
import Tests from "./views/Test.js";
import { theGame } from "./views/theGame.js";

const pageType = {
    LOGIN: 'login',
    MAIN: 'main',
    GAME: 'game',
    STATS: 'stats'
};

const state = {
    page: pageType.LOGIN
};

// const router = async () => {
//     let view = localStorage.getItem('view');
//     if(view == 'Dashboard'){
//         view = Dashboard;
//     } else {
//         view = Tests;
//     }

//     if(view){
//         const test = new view();
//         document.querySelector("#app").innerHTML = await test.getHtml();
//         console.log("here");
        // const dialogElem = document.getElementById("dialog");
        // const showBtn = document.querySelector(".show");
        // const closeBtn = document.querySelector(".close");

        // showBtn.addEventListener("click", () => {
        //     dialogElem.showModal();
        // });

        // closeBtn.addEventListener("click", () => {
        //     dialogElem.close();
        // });
//     } else {
//         const dash = new Dashboard();
//         document.querySelector("#app").innerHTML = await dash.getHtml();
//     }
// };


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
        console.log('Button clicked!');
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
            break;
        case pageType.STATS:
            break;
    }

    // const title = document.querySelector('body');
    // const test = document.createElement('tests-test');
    // title.appendChild(test);
    // title.removeChild(test);
}

setupScreen();