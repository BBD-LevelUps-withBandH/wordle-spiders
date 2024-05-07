import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Testing");
    }

    async getHtml() {
        return `
        <section class="spirdle right">
        <img src="img/spider.png">
    </section>
    <section class="title">
        <section class="welcome">
            <section class="headingtile green">W</section>
            <section class="headingtile yellow">E</section>
            <section class="headingtile red">L</section>
            <section class="headingtile green">C</section>
            <section class="headingtile yellow">O</section>
            <section class="headingtile red">M</section>
            <section class="headingtile green">E</section>
        </section>
        <section class="welcome">
            <section class="headingtile red">T</section>
            <section class="headingtile yellow">O</section>
        </section>
        <section class="welcome">
            <section class="headingtile green">S</section>
            <section class="headingtile yellow">P</section>
            <section class="headingtile red">I</section>
            <section class="headingtile green">R</section>
            <section class="headingtile yellow">D</section>
            <section class="headingtile red">L</section>
            <section class="headingtile green">E</section>
        </section>
        <button class="button" role="button">Login</button>
    </section>

    <section class="spirdle left">
        <img src="img/spiderdddd.png">
    </section>
        `;
    }
}
