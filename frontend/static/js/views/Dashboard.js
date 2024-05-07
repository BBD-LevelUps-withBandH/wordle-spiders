import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Dashboard");
    }

    async getHtml() {
        return `
        <section class="spirdle right">
        <img src="img/spider.png">
    </section>
    <section class="title">
        <section class="home">
            <section class="headingtile green">W</section>
            <section class="headingtile yellow">E</section>
            <section class="headingtile red">L</section>
            <section class="headingtile green">C</section>
            <section class="headingtile yellow">O</section>
            <section class="headingtile red">M</section>
            <section class="headingtile green">E</section>
        </section>
        <section class="home">
            <section class="headingtile red">T</section>
            <section class="headingtile yellow">O</section>
        </section>
        <section class="home">
            <section class="headingtile green">S</section>
            <section class="headingtile yellow">P</section>
            <section class="headingtile red">I</section>
            <section class="headingtile green">R</section>
            <section class="headingtile yellow">D</section>
            <section class="headingtile red">L</section>
            <section class="headingtile green">E</section>
        </section>
        <button class="home-button button show ">How to Play</button>
        <button class="home-button button ">Play</button>
    </section>
    <section class="spirdle left">
        <img src="img/spiderdddd.png">
    </section>

    
    <dialog class="modal" id="dialog">
    </button>
    <section class= "order">
        <section class="How">
        <p class = "htptile htp green">H</p>
        <p class = "htptile htp red">O</p>
        <p class = "htptile htp yellow">W</p>
        </section>
        <section class="To">
        <p class = "htptile htp green">T</p>
        <p class = "htptile htp red">O</p>
         </section>
        <section class="play">
        <p class = "htptile htp yellow">P</p>
        <p class = "htptile htp green">L</p>
        <p class = "htptile htp red">A</p>
        <p class = "htptile htp yellow">Y</p>
        </section> 
        </section>
     
      <p>Welcome to Spirdle, where words weave tales of mystery and discovery. Imagine yourself embarking on an adventure, seeking to uncover a hidden secret—a five-letter word waiting to be revealed.</p>
    
    <p>With each guess, you step closer to unraveling the puzzle. Pay attention to the clues provided—green letters show correct letters in the right place, while yellow hints at correct letters in the wrong spot. And if a letter doesn't belong, it appears gray.</p>
    
    <p>Piece by piece, refine your guesses, letting intuition guide you through the labyrinth of possibilities. Victory comes when the word is finally unveiled. But even if the mystery remains unsolved after six tries, remember, every attempt is a step towards understanding.</p>
    
    <p>Ready to delve into the world of Spirdle? Let the adventure begin, and may the words lead you to triumph!</p>
    <button class="close close-button button">All done</button>
    <dialog>
        `;
    }
}