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
    this.renderArticles();
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

  attributeChangedCallback(name) {
    if (name === "articles") {
      this.renderArticles();
    }
  }

  /**
   * Método para renderizar los artículos que se desean mostrar.
   */
  renderArticles() {
    this.articlesListElement.innerHTML = "";
    const articles = this.articles || [];
    if (articles.length) {
      this.avaibleArticlesToggle(true);
      articles.forEach((article) => {
        const articleItem = document.createElement("app-article");
        articleItem.title = article.title;
        if(article.image) articleItem.image = article.image;
        articleItem.company = article.company;
        articleItem.description = article.description;
        this.articlesListElement.appendChild(articleItem);
      });
    } else {
      this.avaibleArticlesToggle(false);
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
    const avaibleArticles = this.shadowRoot.querySelector('.not-articles');
    if(existArticles) {
      avaibleArticles.classList.remove('active');
    } else {
      avaibleArticles.classList.add('active');
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
}
