import { startGame } from "../GameLogic.js";

export class theGame extends HTMLElement {

    constructor() {
        super();
        const shadowRoot = this.attachShadow({mode: 'open'});
        
        const alertContainer = document.createElement('section');
        alertContainer.className = "alert-container";
        alertContainer.dataset.alertContainer = '';
        shadowRoot.appendChild(alertContainer);

        const grid = document.createElement('section');
        grid.dataset.grid = '';
        grid.className = 'grid';
        this.makeBoard(grid);
        shadowRoot.appendChild(grid);


        const style = document.createElement("style");
        style.textContent = `
        *{
          font-family: Arial, Helvetica, sans-serif;
        }
        
        
        h1{
            /* color: rgb(232, 232, 232); */
            color: rgb(215, 13, 233);
        }
        
        #title{
            display: flex;
            flex-direction: column;
            min-height: 100vh;
            margin: 0;
            padding: 1em;
            font-size: clamp(.5rem, 2.5vmin, 1.5rem);
        }
        
        .grid{
            display: grid;
            justify-content: center;
            align-content: center;
            flex-grow: 1;
            grid-template-columns: repeat(5, 4em);
            grid-template-rows: repeat(6, 4em);
            gap: .25em;
            margin-bottom: 1em;
        }
        
        .tile{
            font-size: 2em;
            /* color: white; */
            color: red;
            border: .05em solid hsl(240, 2%, 23%);
            text-transform: uppercase;
            font-weight: bold;
            display: flex;
            justify-content: center;
            align-items: center;
            user-select: none;
            transition: transform 250ms linear;
        }
        
        .tile.shake{
            animation: shake 250ms ease-in-out;
        
        }
        
        .tile.flip {
            transform: rotateX(90deg);
        }
        
        .tile.dance{
            animation: dance 500ms ease-in-out;
        }
        
        @keyframes shake {
            10% {
              transform: translateX(-5%);
            }
          
            30% {
              transform: translateX(5%);
            }
          
            50% {
              transform: translateX(-7.5%);
            }
          
            70% {
              transform: translateX(7.5%);
            }
          
            90% {
              transform: translateX(-5%);
            }
          
            100% {
              transform: translateX(0);
            }
        }
        
        @keyframes dance {
            20% {
              transform: translateY(-50%);
            }  
          
            40% {
              transform: translateY(5%);
            }  
          
            60% {
              transform: translateY(-25%);
            }  
          
            80% {
              transform: translateY(2.5%);
            }  
          
            90% {
              transform: translateY(-5%);
            }  
          
            100% {
              transform: translateY(0);
            }
        }
        
        .tile[data-state="active"]{
            border-color: hsl(200, 1%, 34%);
        }
        
        .tile[data-state="wrong"]{
            border: none;
            background-color: hsl(240, 2%, 23%);
        }
        
        .tile[data-state="wrong-location"]{
            border: none;
            background-color: hsl(49, 51%, 47%);
        }
        
        .tile[data-state="right"]{
            border: none;
            background-color: hsl(115, 29%, 43%);
        }
        
        .alert-container{
            position: fixed;
            top: 10vh;
            left: 50vw;
            transform: translateX(-50%);
            z-index: 2;
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        
        .alert{
            pointer-events: none;
            background-color: hsl(204, 7%, 85%);
            padding: .75em;
            border-radius: .25em;
            opacity: 1;
            transition: opacity 500ms ease-in-out;
            margin-bottom: .5em;
        }
        
        .alert:last-child{
            margin-bottom: 0;
        }
        
        .alert.hide{
            opacity: 0;
        
        }  
        `;
        shadowRoot.appendChild(style);
    };

    connectedCallback() {
      setTimeout(() => {
        startGame();
      });
    }


    makeBoard(container){
      for(let i = 0; i < 30; i++){
        let sec = document.createElement('span');
        sec.className = 'tile';
        if(i===0) sec.dataset.stateWrong = '';
        container.appendChild(sec);
      }
    }


}

window.customElements.define('the-game', theGame);