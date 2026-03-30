import { api } from './config';

export async function registerSeller({ name, email, password, cnpj, cellphone }) {
  const response = await api.post('/seller/register', {
    name,
    email,
    password,
    cnpj,
    cellphone,
  });
  return response.data;
}
