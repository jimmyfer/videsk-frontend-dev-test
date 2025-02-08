import mainCss from "../../../main.css";
import css from "./dialog.css";
import html from "./dialog.html";

export default class DialogComponent extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: "open" });

    const template = document.createElement("template");
    template.innerHTML = `
            <style>${mainCss.toString()}${css.toString()}</style>
            ${html}
        `;

    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this.closeBtnElement = this.shadowRoot.querySelector(".close-btn");
    this.closeBtnElement.addEventListener("click", () => {
      this.dispatchEvent(new CustomEvent("close"));
    });
  }
}