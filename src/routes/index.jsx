import { SignInView } from '../pages/SignIn/SignIn.view';
import { SignUpView } from '../pages/SignUp/SignUp.view';
import { HomeView } from '../pages/Home/Home.view';
import { createBrowserRouter } from 'react-router';
import { Dashboard } from '../pages/Dashboard';
import { Layout } from '../components/layout';
import { PrivateRouteProvider } from './components/PrivateRouteProvider';
import { CreateProductView } from '../pages/CreateProducts/CreateProducts.view';
import { ListProductsview } from '../pages/Products/ListProducts.view';
import { ProductDetailsView } from '../pages/ProductDetail/Product-detail.view';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomeView />,
  },
  {
    path: '/auth/login',
    element: <SignInView />,
  },
  {
    path: '/seller/register',
    element: <SignUpView />,
  },
  {
    path: '/dashboard',
    element: (
      <PrivateRouteProvider>
        <Layout activeKey='dashboard'>
          <Dashboard />
        </Layout>
      </PrivateRouteProvider>
    ),
  },
  {
    path: '/products',
    element: (
      <PrivateRouteProvider>
        <Layout activeKey='products'>
          <ListProductsview />
        </Layout>
      </PrivateRouteProvider>
    ),
  },
  {
    path: '/products/new',
    element: (
      <PrivateRouteProvider>
        <Layout activeKey='products'>
          <CreateProductView />
        </Layout>
      </PrivateRouteProvider>
    ),
  },
  {
    path: '/product/detail/:id',
    element: (
      <PrivateRouteProvider>
        <Layout activeKey='products'>
          <ProductDetailsView />
        </Layout>
      </PrivateRouteProvider>
    ),
  },
]);
