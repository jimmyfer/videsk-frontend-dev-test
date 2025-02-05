import ArticlesListComponent from "./article-list/articles-list.js";
import ArticleComponent from "./article/article.js";

/**
 * Declaración de componentes
 */
export const componentDefinitions = [
    {
        name: "app-article",
        component: ArticleComponent
    },
    {
        name: "app-articles-list",
        component: ArticlesListComponent
    }
];