import mainCss from "../../../main.css";
import css from "./author.css";
import html from "./author.html";

export default class AuthorComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    const template = document.createElement("template");

    template.innerHTML = `
                        <style>${mainCss.toString()}${css.toString()}</style>
                        ${html}
                    `;

    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this.avatarElement = this.shadowRoot.querySelector(".avatar");
    this.nameElement = this.shadowRoot.querySelector(".name");
    this.birthdateElement = this.shadowRoot.querySelector(".birthdate");
    this.bioElement = this.shadowRoot.querySelector(".bio");

    this.avatarElement.onerror = () => this.handleImageError();
  }

  static get observedAttributes() {
    return ["name", "avatar", "birthdate", "bio"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this[name] = newValue;
    }
  }

  get name() {
    return this.getAttribute("name");
  }

  set name(value) {
    this.setAttribute("name", value);
    this.nameElement.textContent = value;
  }

  get avatar() {
    return this.getAttribute("avatar");
  }

  set avatar(value) {
    this.setAttribute("avatar", value);
    this.avatarElement.src = value;
  }

  get birthdate() {
    return this.getAttribute("birthdate");
  }

  set birthdate(value) {
    this.setAttribute("birthdate", value);
    this.birthdateElement.textContent = new Date(value).toLocaleDateString();
  }

  get bio() {
    return this.getAttribute("bio");
  }

  set bio(value) {
    this.setAttribute("bio", value);
    this.bioElement.textContent = value;
  }

  /**
   * Maneja el error de carga de la imagen y muestra un SVG con las iniciales.
   */
  handleImageError() {
    const initials = this.getInitials(this.name || "A"); // Obtener iniciales
    const svg = `
      <svg 
        class="avatar w-32 h-32 rounded-full border-4 border-gray-200" 
        viewBox="0 0 100 100" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="50" cy="50" r="50" fill="#6b7280" /> <!-- Fondo gris -->
        <text 
          x="50%" 
          y="50%" 
          fill="#ffffff" 
          font-size="40" 
          text-anchor="middle" 
          dy=".3em" 
          font-family="Arial, sans-serif"
        >
          ${initials}
        </text>
      </svg>
    `;

    this.avatarElement.outerHTML = svg;
  }

  /**
   * Obtiene las iniciales de un nombre.
   * @param {string} name - Nombre completo del autor.
   * @returns {string} - Iniciales (1 o 2 caracteres).
   */
  getInitials(name) {
    const names = name.trim().split(" ");
    if (names.length === 1) return names[0][0].toUpperCase();
    return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
  }
}
