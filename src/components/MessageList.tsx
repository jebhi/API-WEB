import { useChatStore } from '../store/chats';
import MessageItem from './MessageItem';

interface Props {
  chatId: string;
}

export default function MessageList({ chatId }: Props) {
  const messages =
    useChatStore((s) => s.chats.find((c) => c.id === chatId)?.messages) || [];

  return (
    <div className="flex-1 overflow-y-auto p-4">
      {messages.map((m) => (
        <MessageItem key={m.id} chatId={chatId} msg={m} />
      ))}
    </div>
  );
}
