import mainCss from "../../../main.css";
import css from "./dropdown-button.css";
import html from "./dropdown-button.html";

export default class DropdownButtonComponent extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: "open" });

    const template = document.createElement("template");
    template.innerHTML = `
            <style>${mainCss.toString()}${css.toString()}</style>
            ${html}
        `;

    this.shadowRoot.appendChild(template.content.cloneNode(true));

    // Propiedad para determinar cual de todos los componentes esta activo
    this.activeDropdown = false;

    const dropdownButton = this.shadowRoot.querySelector('.dropdown-button');
    const dropdownContainer = this.shadowRoot.querySelector('.dropdown');

    // Escuchamos el evento click para expandir el menú
    dropdownButton.addEventListener('click', () => {
      this.dropdownToggle();
    });

    // Escuchamos el evento click de elementos externos para cerrar el menú
    document.addEventListener('click', (event) => {

      // con activeDropdown nos aseguramos que tambien se cierre el menú al 
      // hacer click en otras instancias de DropdownButtonComponent
      if (!this.shadowRoot.contains(event.target) && this.activeDropdown != true) {
        dropdownContainer.classList.remove('active');
      } else {
        this.activeDropdown = false;
      }
    });
  }

  set options(options) {
    this._options = options;
    this.renderOptions();
  }

  get options() {
    return this._options;
  }

  set activeOption(activeOption) {
    this._activeOption = activeOption;
    this.changeActiveOption();
  }

  get activeOption() {
    return this._activeOption;
  }

  /**
   * Método para renderizar el componente.
   */
  renderOptions() {
    const dropdownContent = this.shadowRoot.querySelector(".dropdown-content");
    dropdownContent.innerHTML = "";
    this.options.forEach((option) => {
      const dropdownOption = document.createElement("a");
      dropdownOption.classList.add("option");
      dropdownOption.setAttribute("href", "#");
      dropdownOption.setAttribute("data-value", JSON.stringify(option));
      dropdownOption.innerText = option.label;
      dropdownContent.appendChild(dropdownOption);
    });

    this.shadowRoot.querySelectorAll(".option").forEach((option) => {
      option.addEventListener("click", () => this.handleOptionClick(option));
    });
  }

  /**
   * Método para actualizar el label con la opción activa.
   */
  changeActiveOption() {
    const dropdownButtonSpan = this.shadowRoot.querySelector("button > span");
    dropdownButtonSpan.innerText = this.activeOption.label;
  }

  /**
   * Método para esconder/mostrar el menú.
   */
  dropdownToggle() {
    const dropdownContainer = this.shadowRoot.querySelector('.dropdown');
    this.activeDropdown = !this.activeDropdown;
    dropdownContainer.classList.toggle('active');
  }

  /**
   * Método para manejar el click en las opciones del menú.
   * @param {object} option 
   */
  handleOptionClick(option) {
    if (this._activeOption) {
      const activeElement = this.shadowRoot.querySelector(
        `.option[data-value='${JSON.stringify(this._activeOption)}']`
      );
      if (activeElement) {
        activeElement.classList.remove("active");
      }
    }
    option.classList.add("active");
    const selectedOption = JSON.parse(option.getAttribute("data-value"));
    this.activeOption = selectedOption;
    this.dispatchEvent(
      new CustomEvent("option-selected", {
        detail: selectedOption,
      })
    );
    this.dropdownToggle();
  }
}
