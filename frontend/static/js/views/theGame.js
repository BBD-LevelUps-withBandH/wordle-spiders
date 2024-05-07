export class theGame extends HTMLElement {
    constructor() {
        super();
        const shadowRoot = this.attachShadow({mode: 'closed'});
        
        const element = document.createElement('div');
        element.className = "boo";
        element.innerText = "HEREEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE";

        const style = document.createElement("style");
        style.textContent = `
      .boo {
        background: red;
        color: blue;
      }
    `;
      shadowRoot.appendChild(element);
      shadowRoot.appendChild(style);

    }
}

customElements.define('tests-test', theGame);