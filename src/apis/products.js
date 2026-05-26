import { api } from './config';

export const createProduct = async ({ name, price, quantity, img }) => {
  const response = await api.post('/product', {
    name,
    price,
    quantity,
    img,
  });
  return response.data;
};

export const getProducts = async () => {
  const response = await api.get('/product');
  return response.data;
};

export const getProduct = async (id) => {
  const response = await api.get(`/product/${id}`);
  return response.data;
};

export const updateProduct = async (
  id,
  { name, price, quantity, img, status }
) => {
  const response = await api.put(`/product/${id}`, {
    name,
    price,
    quantity,
    img,
    status,
  });
  return response.data;
};

export const deleteProduct = async (id) => {
  const response = await api.delete(`/product/${id}`);
  return response.data;
};

export const restockProduct = async (id, quantity) => {
  const response = await api.patch(`/product/${id}/restock`, { quantity });
  return response.data;
};
