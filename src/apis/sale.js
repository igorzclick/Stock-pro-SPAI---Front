import { api } from './config';

export const createSale = async ({ product_id, quantity }) => {
  const response = await api.post('sale', {
    product_id,
    quantity,
  });
  return response.data;
};

export const getSales = async () => {
  const response = await api.get('sale');
  return response.data;
};

export const deleteSale = async (saleId) => {
  const response = await api.delete(`sale/${saleId}`);
  return response.data;
};
