import mainCss from "../../../main.css";
import css from "./articles-list.css";
import html from "./articles-list.html";
import articleService from "../../../services/article-service";

export default class ArticlesListComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    const template = document.createElement("template");

    template.innerHTML = `
                    <style>${mainCss.toString()}${css.toString()}</style>
                    ${html}
                `;

    this.httpParams = {
      search: "",
      sortBy: "title",
      order: "asc",
      limit: 5,
      page: 1,
    };

    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.articlesListElement = this.shadowRoot.querySelector(".articles-list");

    // Escuchamos el elemento input que funciona para buscar artículos y le agregamos
    // un debouncer.
    const inputSearch = this.shadowRoot.querySelector(".search-input");
    inputSearch.addEventListener(
      "input",
      this.debounce(() => {
        this.updateHttpParams("search", inputSearch.value);
      }, 400)
    );

    this.loadArticlesQuantityDropdown();
    this.loadArticlesSortByDropdown();
    this.loadArticlesOrderDropdown();
    this.loadArticles();
  }

  set articles(value) {
    this.setAttribute("articles", JSON.stringify(value));
  }

  get articles() {
    return JSON.parse(this.getAttribute("articles"));
  }

  static get observedAttributes() {
    return ["articles"];
  }

  /**
   * Método para cargar el orden de los artículos que se desean mostrar.
   */
  loadArticlesOrderDropdown() {
    const articlesQuantityOptions = [
      { label: "Ascendente", value: "asc" },
      { label: "Descendente", value: "desc" },
    ];

    const articlesQuantityDropdown =
      this.shadowRoot.querySelector(".articles-order");
    articlesQuantityDropdown.options = articlesQuantityOptions;
    articlesQuantityDropdown.activeOption = articlesQuantityOptions[0];

    articlesQuantityDropdown.addEventListener("option-selected", (event) => {
      this.updateHttpParams("order", event.detail.value);
    });
  }

  /**
   * Método para cargar la clasificación de los artículos que se desean mostrar.
   */
  loadArticlesSortByDropdown() {
    const articlesQuantityOptions = [
      { label: "Título", value: "title" },
      { label: "Compañía", value: "company" },
      { label: "Autor", value: "autor" },
    ];

    const articlesQuantityDropdown =
      this.shadowRoot.querySelector(".articles-sort-by");
    articlesQuantityDropdown.options = articlesQuantityOptions;
    articlesQuantityDropdown.activeOption = articlesQuantityOptions[0];

    articlesQuantityDropdown.addEventListener("option-selected", (event) => {
      this.updateHttpParams("sortBy", event.detail.value);
    });
  }

  /**
   * Método para cargar la cantidad de artículos que se desean mostrar.
   */
  loadArticlesQuantityDropdown() {
    const articlesQuantityOptions = [
      { label: "5 artículos", value: 5 },
      { label: "10 artículos", value: 10 },
      { label: "20 artículos", value: 20 },
      { label: "30 artículos", value: 30 },
      { label: "40 artículos", value: 40 },
      { label: "50 artículos", value: 50 },
    ];

    const articlesQuantityDropdown =
      this.shadowRoot.querySelector(".articles-quantity");
    articlesQuantityDropdown.options = articlesQuantityOptions;
    articlesQuantityDropdown.activeOption = articlesQuantityOptions[0];

    articlesQuantityDropdown.addEventListener("option-selected", (event) => {
      this.updateHttpParams("limit", event.detail.value);
    });
  }

  /**
   * Método para cargar los artículos que se desean mostrar.
   */
  async loadArticles() {
    this.articles = this.emptyArticles();
    this.articles = await articleService.fetchAllArticles(this.httpParams);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "articles" && oldValue != newValue) {
      this.renderArticles();
    }
  }

  emptyArticles() {
    const emptyArticles = [];
    for (let index = 0; index < this.httpParams.limit; index++) {
      emptyArticles.push({});
    }
    return emptyArticles;
  }

  /**
   * Método para mostrar o no mostrar el mensaje de "No se ha encontrado ningún artículo" en pantalla.
   * @param {boolean} existArticles La variable que determine si encontraron artículos o no.
   */
  avaibleArticlesToggle(existArticles) {
    const avaibleArticles = this.shadowRoot.querySelector(".not-articles");
    if (existArticles) {
      avaibleArticles.classList.remove("active");
    } else {
      avaibleArticles.classList.add("active");
    }
  }

  /**
   * Método para actualizar los parametros con los que se filtran los artículos.
   * @param {string} key Nombre del filtro.
   * @param {string|number} value Valor del filtro.
   */
  updateHttpParams(key, value) {
    this.httpParams[key] = value;
    this.loadArticles();
  }

  /**
   * Función debounce que retrasa la ejecución de una función hasta que
   * haya pasado un cierto tiempo sin que se vuelva a llamar.
   *
   * @param {Function} func La función que se desea ejecutar después del retraso.
   * @param {number} delay El tiempo de retraso en milisegundos antes de ejecutar la función.
   * @returns {Function} Una nueva función que ejecutará `func` después del retraso especificado.
   */
  debounce(func, delay) {
    let debounceTimer;
    return function () {
      const context = this;
      const args = arguments;
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => func.apply(context, args), delay);
    };
  }

  /**
   * Método para renderizar los artículos que se desean mostrar.
   */
  renderArticles() {
    this.clearArticlesList();

    const articles = this.articles || [];
    if (articles.length) {
      this.toggleAvailableArticlesMessage(true);
      articles.forEach((article) => this.renderArticle(article));
    } else {
      this.toggleAvailableArticlesMessage(false);
    }
  }

  /**
   * Limpia la lista de artículos.
   */
  clearArticlesList() {
    this.articlesListElement.innerHTML = "";
  }

  /**
   * Muestra u oculta el mensaje de "No hay artículos disponibles".
   * @param {boolean} showMessage Indica si se debe mostrar el mensaje.
   */
  toggleAvailableArticlesMessage(showMessage) {
    const notArticlesElement = this.shadowRoot.querySelector(".not-articles");
    if (showMessage) {
      notArticlesElement.classList.remove("active");
    } else {
      notArticlesElement.classList.add("active");
    }
  }

  /**
   * Renderiza un artículo individual.
   * @param {Object} article El artículo a renderizar.
   */
  renderArticle(article) {
    const articleItem = this.createArticleItem(article);
    this.articlesListElement.appendChild(articleItem);

    articleItem.addEventListener("click", () =>
      this.openArticleDialog(articleItem, article)
    );
  }

  /**
   * Crea un elemento de artículo.
   * @param {Object} article El artículo a representar.
   * @returns {HTMLElement} El elemento del artículo creado.
   */
  createArticleItem(article) {
    const articleItem = document.createElement("app-article");
    articleItem.mode = "card";
    articleItem.title = article.title;
    if (article.image) articleItem.image = article.image;
    articleItem.company = article.company;
    articleItem.description = article.description;
    articleItem.content = article.content;
    return articleItem;
  }

  /**
   * Abre un diálogo con los detalles del artículo.
   * @param {HTMLElement} articleItem El elemento del artículo que se hizo clic.
   * @param {Object} article Los datos del artículo.
   */
  openArticleDialog(articleItem, article) {
    const articleDialog = document.createElement("ui-dialog");
    const slotContent = this.createDialogContent(articleItem, article);
    articleDialog.appendChild(slotContent);

    this.shadowRoot.appendChild(articleDialog);

    // Deshabilita el scroll del body
    document.body.classList.add("no-scroll");

    this.setupDialogCloseListener(articleDialog);
  }

  /**
   * Crea el contenido del diálogo.
   * @param {HTMLElement} articleItem El elemento del artículo que se hizo clic.
   * @param {Object} article Los datos del artículo.
   * @returns {HTMLElement} El contenido del diálogo.
   */
  createDialogContent(articleItem, article) {
    const slotContent = document.createElement("div");
    slotContent.setAttribute("slot", "content");

    const dialogArticleItem = articleItem.cloneNode(true);
    dialogArticleItem.mode = "normal";
    dialogArticleItem.title = article.title;
    if (article.image) dialogArticleItem.image = article.image;
    dialogArticleItem.company = article.company;
    dialogArticleItem.description = article.description;
    dialogArticleItem.content = article.content;

    slotContent.appendChild(dialogArticleItem);
    return slotContent;
  }

  /**
   * Configura el listener para cerrar el diálogo.
   * @param {HTMLElement} dialog El diálogo al que se le agregará el listener.
   */
  setupDialogCloseListener(dialog) {
    dialog.addEventListener("close", () => {
      dialog.remove();

      // Habilita el scroll del body
      document.body.classList.remove("no-scroll");
    });
  }
}
