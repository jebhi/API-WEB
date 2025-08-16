import { createBrowserRouter, redirect } from 'react-router-dom';
import ChatPage from './pages/ChatPage';
import SettingsPage from './pages/SettingsPage';

const router = createBrowserRouter([
  { path: '/chat/:id', element: <ChatPage /> },
  { path: '/settings', element: <SettingsPage /> },
  { path: '*', loader: () => redirect('/chat/new') },
]);

export default router;
