import css from "./dialog.css";
import html from "./dialog.html";

export default class DialogComponent extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: "open" });

    const template = document.createElement("template");
    template.innerHTML = `
            <style>${css.toString()}</style>
            ${html}
        `;

    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
}