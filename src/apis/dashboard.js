import { api } from './config';

export const getLowStockProducts = async () => {
  const response = await api.get('/product/low-stock');
  return response.data;
};

export const getTopSellingProducts = async () => {
  const response = await api.get('/sale/top-products');
  return response.data;
};

export const getSalesSummary = async () => {
  const response = await api.get('/sale/summary');
  return response.data;
};

export const getDashboardMetrics = async () => {
  const response = await api.get('/sale/dashboard-metrics');
  return response.data;
};
