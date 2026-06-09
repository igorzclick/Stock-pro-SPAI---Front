import { SignInView } from '../pages/SignIn/SignIn.view';
import { SignUpView } from '../pages/SignUp/SignUp.view';
import { HomeView } from '../pages/Home/Home.view';
import { createBrowserRouter } from 'react-router';
import { PrivateRouteProvider } from './components/PrivateRouteProvider';
import { ListProductsview } from '../pages/Products/ListProducts.view';
import { Layout } from '../components/layout';
import { DashboardView } from '../pages/Dashboards/Dashboard.view';
import { SalesView } from '../pages/Sales/Sales.view';
import { EditProductView } from '../pages/EditProducts/EditProducts.view';
import { CreateProductView } from '../pages/CreateProducts/CreateProducts.view';
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
    path: '/products/edit/:id',
    element: (
      <PrivateRouteProvider>
        <Layout activeKey='products'>
          <EditProductView />
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
  {
    path: '/sales',
    element: (
      <PrivateRouteProvider>
        <Layout activeKey='sales'>
          <SalesView />
        </Layout>
      </PrivateRouteProvider>
    ),
  },
  {
    path: '/dashboard',
    element: (
      <PrivateRouteProvider>
        <Layout activeKey='dashboard'>
          <DashboardView />
        </Layout>
      </PrivateRouteProvider>
    ),
  },
]);
