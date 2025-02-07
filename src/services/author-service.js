const BASE_URL = "https://5fb46367e473ab0016a1654d.mockapi.io/";
const CACHE_TTL = 300000; // 5 minutos en milisegundos

class AuthorService {
  constructor() {
    this.authorCache = new Map();
    this.activeRequests = new Map();
  }

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
   * Obtiene un autor por ID con caché y manejo de solicitudes concurrentes
   * @param {string} id - ID del autor
   * @returns {Promise<Object>} - Datos del autor
   */
  async fetchAuthorById(id) {
    // Verificar caché válido
    if (this.authorCache.has(id)) {
      const { data, timestamp } = this.authorCache.get(id);
      if (Date.now() - timestamp < CACHE_TTL) return data;
    }

    // Manejar solicitudes concurrentes
    if (this.activeRequests.has(id)) {
      return this.activeRequests.get(id);
    }

    try {
      const request = this.fetchData(`users/${id}`);
      this.activeRequests.set(id, request);

      const data = await request;

      this.authorCache.set(id, {
        data,
        timestamp: Date.now(),
      });

      return data;
    } finally {
      this.activeRequests.delete(id);
    }
  }
}

export default new AuthorService();
