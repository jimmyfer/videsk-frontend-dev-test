import mainCss from "../../../main.css";
import css from "./article.css";
import htmlNormal from "./article-normal.html";
import htmlCard from "./article-card.html";

export default class ArticleComponent extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: "open" });

  }

  get title() {
    return this.getAttribute("title");
  }

  set title(value) {
    this.setAttribute("title", value);
    if(this.titleElement) this.titleElement.textContent = value;
  }

  get image() {
    return this.getAttribute("image");
  }

  set image(value) {
    this.setAttribute("image", value);
    if(this.imageElement) {
      this.imageElement.classList.remove("hidden");
      this.imageElement.src = value;
    }
  }

  get company() {
    return this.getAttribute("company");
  }

  set company(value) {
    this.setAttribute("company", value);
    if(this.companyElement) this.companyElement.textContent = value;
  }

  get description() {
    return this.getAttribute("description");
  }

  set description(value) {
    this.setAttribute("description", value);
    if(this.descriptionElement) this.descriptionElement.textContent = value;
  }

  get content() {
    return this.getAttribute("content");
  }

  set content(value) {
    this.setAttribute("content", value);
    if(this.contentElement) this.contentElement.textContent = value;
  }

  static get observedAttributes() {
    return ["title", "image", "company", "description", "content", "mode"];
  }

  set mode(value) {
    this.setAttribute("mode", value);
    this.renderArticle();
  }

  get mode() {
    return this.getAttribute("mode");
  }

  renderArticle() {
    const html = this.mode === "card" ? htmlCard : htmlNormal;

    const template = document.createElement("template");
    template.innerHTML = `
      <style>${mainCss.toString()}${css.toString()}</style>
      ${html}
    `;

    this.shadowRoot.innerHTML = "";
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this.titleElement = this.shadowRoot.querySelector(".title");
    this.imageElement = this.shadowRoot.querySelector(".image");
    this.companyElement = this.shadowRoot.querySelector(".company");
    this.descriptionElement = this.shadowRoot.querySelector(".description");
    this.contentElement = this.shadowRoot.querySelector(".full-content");
    
    if (this.mode === "card") {
      this.imageElement.onload = () => {
        const loaderArticle = this.shadowRoot.querySelector(".loader-article");
        loaderArticle.classList.add("hidden");
      };
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue != newValue) {
      this[name] = newValue;
    }
  }
}
