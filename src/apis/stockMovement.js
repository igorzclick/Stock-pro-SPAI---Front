import { api } from './config';

// Monta a query string a partir dos filtros ativos (ignora vazios/"all")
const buildQuery = ({ product_id, type, period } = {}) => {
  const params = new URLSearchParams();
  if (product_id) params.append('product_id', product_id);
  if (type && type !== 'all') params.append('type', type);
  if (period && period !== 'all') params.append('period', period);
  const qs = params.toString();
  return qs ? `?${qs}` : '';
};

export const getStockMovements = async (filters) => {
  const response = await api.get(`/stock-movement${buildQuery(filters)}`);
  return response.data;
};

// Baixa o CSV respeitando o JWT: pede como blob (interceptor injeta o token)
// e dispara o download programaticamente, sem expor o token numa URL.
export const exportStockMovements = async (filters) => {
  const response = await api.get(`/stock-movement/export${buildQuery(filters)}`, {
    responseType: 'blob',
  });

  const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8;' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'historico_estoque.csv');
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};
