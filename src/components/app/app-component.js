import ArticlesListComponent from "./article-list/articles-list.js";
import ArticleComponent from "./article/article.js";
import AuthorComponent from "./author/author.js";

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
    },
    {
        name: "app-author",
        component: AuthorComponent
    }
];