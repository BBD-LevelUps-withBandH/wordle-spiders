import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Testing");
    }

    async getHtml() {
        return `
            <h1>Test</h1>
            <p>Testing stuffs.</p>

            <p>
            <a href="/" data-link>View Dash</a>.
            </p>
        `;
    }
}
