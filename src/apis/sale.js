import { api } from './config';

export const createSale = async ({ product_id, quantity }) => {
  const response = await api.post('/sale', {
    product_id,
    quantity,
  });
  return response.data;
};

export const getSales = async (period) => {
  const url =
    period && period !== 'all' ? `/sale?period=${period}` : '/sale';
  const response = await api.get(url);
  return response.data;
};

export const deleteSale = async (saleId) => {
  const response = await api.delete(`/sale/${saleId}`);
  return response.data;
};

export const toggleActiveSale = async (saleId) => {
  const response = await api.patch(`/sale/${saleId}/toggle-active`);
  return response.data;
};
