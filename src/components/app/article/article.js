import mainCss from "../../../main.css";
import css from "./article.css";
import html from "./article.html";

export default class ArticleComponent extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: "open" });

    const template = document.createElement("template");
    template.innerHTML = `
            <style>${mainCss.toString()}${css.toString()}</style>
            ${html}
        `;

    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this.titleElement = this.shadowRoot.querySelector(".title");
    this.imageElement = this.shadowRoot.querySelector(".image");
    this.companyElement = this.shadowRoot.querySelector(".company");
    this.descriptionElement = this.shadowRoot.querySelector(".description");

    this.shadowRoot
      .querySelector(".article")
      .addEventListener("click", () => this.showFullContent());
  }
  
  get title() {
    return this.getAttribute("title");
  }

  set title(value) {
    this.setAttribute("title", value);
    this.titleElement.textContent = value;
  }

  get image() {
    return this.getAttribute("image");
  }

  set image(value) {
    this.setAttribute("image", value);
    this.imageElement.src = value;
  }

  get company() {
    return this.getAttribute("company");
  }

  set company(value) {
    this.setAttribute("company", value);
    this.companyElement.textContent = value;
  }

  get description() {
    return this.getAttribute("description");
  }

  set description(value) {
    this.setAttribute("description", value);
    this.descriptionElement.textContent = value;
  }
  static get observedAttributes() {
    return ["title", "image", "company", "description"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if(oldValue != newValue) {
      this[name] = newValue;
    }
  }
}
