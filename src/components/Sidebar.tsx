import { useChatStore } from '../store/chats';
import { useEffect, useRef, useState } from 'react';
import { Plus, Pin, PinOff, Search, Trash2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function Sidebar() {
  const {
    chats,
    create,
    remove,
    rename,
    pin,
    currentId,
    setCurrent,
  } = useChatStore();
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        const id = create();
        navigate(`/chat/${id}`);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'f') {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [create, navigate]);

  const filtered = chats.filter((c) =>
    c.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <aside className="w-64 p-2 border-r overflow-y-auto">
      <div className="flex items-center mb-2">
        <button
          className="btn btn-sm btn-primary"
          onClick={() => {
            const id = create();
            navigate(`/chat/${id}`);
          }}
          aria-label="新建会话 (Cmd/Ctrl+K)"
        >
          <Plus size={16} />
        </button>
        <div className="ml-2 flex-1">
          <label className="input input-sm flex items-center gap-2">
            <Search size={14} />
            <input
              ref={searchRef}
              type="text"
              placeholder="搜索"
              className="grow"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>
        </div>
      </div>

      <ul>
        {filtered.map((c) => (
          <li key={c.id}>
            <Link
              to={`/chat/${c.id}`}
              className={`flex items-center justify-between p-2 rounded hover:bg-base-200 ${
                currentId === c.id ? 'bg-base-200' : ''
              }`}
              onClick={() => setCurrent(c.id)}
            >
              <span className="truncate">{c.title}</span>
              <div className="flex gap-1">
                <button
                  className="btn btn-ghost btn-xs"
                  aria-label={c.pinned ? '取消置顶' : '置顶'}
                  onClick={(e) => {
                    e.preventDefault();
                    pin(c.id, !c.pinned);
                  }}
                >
                  {c.pinned ? <PinOff size={14} /> : <Pin size={14} />}
                </button>
                <button
                  className="btn btn-ghost btn-xs"
                  aria-label="删除会话"
                  onClick={(e) => {
                    e.preventDefault();
                    remove(c.id);
                  }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
