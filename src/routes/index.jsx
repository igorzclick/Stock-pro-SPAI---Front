import { SignInView } from '../pages/SignIn/SignIn.view';
import { SignUpView } from '../pages/SignUp/SignUp.view';
import { HomeView } from '../pages/Home/Home.view';
import { createBrowserRouter } from 'react-router';

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
]);
