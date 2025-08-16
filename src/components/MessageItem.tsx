import { Message } from '../store/chats';
import { renderMarkdown } from '../lib/markdown';
import { Copy, RefreshCw, Trash2 } from 'lucide-react';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';
import { useChatStore } from '../store/chats';

interface Props {
  chatId: string;
  msg: Message;
}

export default function MessageItem({ chatId, msg }: Props) {
  const updateMessage = useChatStore((s) => s.updateMessage);
  return (
    <div className="group my-2">
      <div className="flex justify-between text-sm text-base-content/60">
        <span>{msg.role === 'user' ? 'You' : 'AI'}</span>
        <span>{dayjs(msg.timestamp).format('HH:mm:ss')}</span>
      </div>

      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={renderMarkdown(msg.content)}
      />

      <div className="opacity-0 group-hover:opacity-100 transition flex gap-1 mt-1">
        <button
          className="btn btn-ghost btn-xs"
          aria-label="复制"
          onClick={() => {
            navigator.clipboard.writeText(msg.content);
            toast.success('已复制');
          }}
        >
          <Copy size={14} />
        </button>
        {msg.role === 'assistant' && (
          <button
            className="btn btn-ghost btn-xs"
            aria-label="重试"
            onClick={() =>
              updateMessage(chatId, msg.id, { status: 'sending' })
            }
          >
            <RefreshCw size={14} />
          </button>
        )}
        <button
          className="btn btn-ghost btn-xs"
          aria-label="删除"
          onClick={() =>
            updateMessage(chatId, msg.id, { content: '[deleted]' })
          }
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}
