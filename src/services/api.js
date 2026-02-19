import { MODELOS } from '../data/modelos';

/**
 * Simula una llamada asíncrona a la base de datos (Postgres).
 * En el futuro, esto será: return axios.get(`/api/products?tipo=${tipo}`);
 */
export const fetchProducts = async (filtros) => {
  return new Promise((resolve) => {
    // Simulamos latencia de red (500ms)
    setTimeout(() => {
      let resultados = MODELOS;

      // Lógica de filtrado (Backend logic simulation)
      if (filtros.tipo && filtros.tipo !== 'todos') {
        resultados = resultados.filter(p => p.tipo === filtros.tipo);
      }

      // Ejemplo: Futuro filtro de precio
      // if (filtros.maxPrice) { ... }

      resolve(resultados);
    }, 500);
  });
};