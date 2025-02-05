const BASE_URL = "https://5fb46367e473ab0016a1654d.mockapi.io/";

class ArticleService {

  /**
   * Método para obtener datos del endpoint de artículos con parámetros de búsqueda, orden, límite y paginación.
   * @param {string} endpoint - El endpoint de la API al que se realizará la solicitud.
   * @param {object} params - Objeto con los parámetros de la solicitud.
   * @returns {Promise<array|object>} - Retorna los datos en formato JSON o un array vacío si no se encuentran datos.
   * @throws {Error} - Lanza un error si la respuesta no es exitosa.
   */
  async fetchData(endpoint, params = {}) {
    const url = new URL(`${BASE_URL}${endpoint}`);
    Object.keys(params).forEach((key) =>
      url.searchParams.append(key, params[key])
    );

    const response = await fetch(url);
    if (response.status == 404) {
      return [];
    } else if (!response.ok) {
      throw new Error("Hubo un problema al cargar los datos!");
    }
    return response.json();
  }
  
  /**
   * Método para obtener todos los artículos con parámetros de búsqueda, orden, límite y paginación.
   * @param {object} params - Objeto con los parámetros de búsqueda (search, sortBy, order, limit, page).
   * @returns {Promise<array>} - Retorna una promesa que resuelve con los datos de los artículos.
   */
	async fetchAllArticles({ search, sortBy, order, limit, page }) {
    const params = {
      search,
      sortBy,
      order,
      limit,
      page
    };
			return this.fetchData('articles', params);
	}
}

export default new ArticleService();
