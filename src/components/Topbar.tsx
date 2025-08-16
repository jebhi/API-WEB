import { useSettingsStore } from '../store/settings';
import { useThemeStore } from '../store/theme';
import { Link } from 'react-router-dom';
import { Settings, Sun, Moon } from 'lucide-react';
import { useChatStore } from '../store/chats';

export default function Topbar() {
  const { settings, setSettings } = useSettingsStore();
  const { theme, toggle } = useThemeStore();
  const { chats, currentId } = useChatStore();
  const title = chats.find((c) => c.id === currentId)?.title || 'Chat';

  return (
    <header className="flex items-center justify-between p-2 border-b">
      <h1 className="truncate">{title}</h1>
      <div className="flex items-center gap-2">
        <select
          className="select select-xs"
          value={settings.model}
          onChange={(e) => setSettings({ model: e.target.value })}
          aria-label="模型选择"
        >
          <option>gpt-3.5-turbo</option>
          <option>gpt-4</option>
        </select>

        <Link to="/settings" className="btn btn-ghost btn-xs" aria-label="设置">
          <Settings size={16} />
        </Link>

        <button
          className="btn btn-ghost btn-xs"
          onClick={toggle}
          aria-label="切换主题 (Cmd/Ctrl+Shift+D)"
        >
          {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
        </button>
      </div>
    </header>
  );
}
