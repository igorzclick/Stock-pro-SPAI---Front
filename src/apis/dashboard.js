import { api } from './config';

export const getLowStockProducts = async () => {
  const response = await api.get('/dashboard/low-stock');
  return response.data;
};

export const getTopSellingProducts = async () => {
  const response = await api.get('/dashboard/top-products');
  return response.data;
};

export const getSalesSummary = async () => {
  const response = await api.get('/dashboard/sales-summary');
  return response.data;
};

export const getDashboardMetrics = async () => {
  const response = await api.get('/dashboard/metrics');
  return response.data;
};
