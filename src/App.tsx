import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import router from './router';
import { useThemeStore } from './store/theme';

export default function App() {
  const { theme } = useThemeStore();

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  return <RouterProvider router={router} />;
}
