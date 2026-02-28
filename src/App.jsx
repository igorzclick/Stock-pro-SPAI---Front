import { RouterProvider } from 'react-router';
import { router } from './routes';
import { Provider } from './components/ui/provider';
import { Toaster } from './components/ui/toaster';

function App() {
  return (
    <Provider>
      <Toaster />
      <RouterProvider router={router} />
    </Provider>
  );
}

export default App;
