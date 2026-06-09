import { Navigate } from 'react-router';
import { getToken } from '../../apis/login';

export const PrivateRouteProvider = ({ children }) => {
  const token = getToken();

  if (!token) {
    return <Navigate to={'/auth/login'} />;
  }

  return children;
};
