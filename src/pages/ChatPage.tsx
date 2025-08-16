import { useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import MessageList from '../components/MessageList';
import ChatInput from '../components/ChatInput';
import { useChatStore } from '../store/chats';
import { useParams, useNavigate } from 'react-router-dom';
import { useThemeStore } from '../store/theme';

export default function ChatPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { chats, setCurrent, create } = useChatStore();
  const { toggle } = useThemeStore();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        toggle();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [toggle]);

  useEffect(() => {
    if (!id) {
      const newId = create();
      navigate(`/chat/${newId}`, { replace: true });
    } else {
      setCurrent(id);
    }
  }, [id, create, navigate, setCurrent]);

  if (!id) return null;

  return (
    <div className="h-screen flex">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Topbar />
        <MessageList chatId={id} />
        <ChatInput chatId={id} />
      </div>
    </div>
  );
}
