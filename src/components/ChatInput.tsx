import { FormEvent, useRef, useState } from 'react';
import { useChatStore } from '../store/chats';
import { useSettingsStore } from '../store/settings';
import { chatCompletion } from '../lib/chatApi';

interface Props {
  chatId: string;
}

export default function ChatInput({ chatId }: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { settings } = useSettingsStore();
  const addMessage = useChatStore((s) => s.addMessage);
  const updateMessage = useChatStore((s) => s.updateMessage);
  const messages =
    useChatStore((s) => s.chats.find((c) => c.id === chatId)?.messages) || [];
  const [input, setInput] = useState('');
  const [aborter, setAborter] = useState<AbortController | null>(null);
  const tokenCount = input.length;

  function handleSubmit(e?: FormEvent) {
    e?.preventDefault();
    if (!input.trim()) return;
    if (!settings.apiKey) {
      alert('缺少 API Key');
      return;
    }
    const userMsg = {
      id: crypto.randomUUID(),
      role: 'user' as const,
      content: input,
      timestamp: Date.now(),
    };
    addMessage(chatId, userMsg);
    setInput('');

    const asstId = crypto.randomUUID();
    addMessage(chatId, {
      id: asstId,
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
      status: 'sending',
    });

    const controller = new AbortController();
    setAborter(controller);

    chatCompletion(
      settings,
      [...messages, userMsg],
      (delta) =>
        updateMessage(chatId, asstId, (m) => ({ content: m.content + delta })),
      controller.signal
    ).then(() => updateMessage(chatId, asstId, { status: undefined }));
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t flex flex-col gap-2">
      <textarea
        ref={textareaRef}
        className="textarea textarea-bordered w-full"
        rows={3}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        aria-label="输入框"
      />
      <div className="flex justify-between items-center">
        <span className="text-sm opacity-60">{tokenCount} tokens</span>
        {aborter ? (
          <button
            type="button"
            className="btn btn-error btn-sm"
            onClick={() => aborter.abort()}
          >
            Stop
          </button>
        ) : (
          <button type="submit" className="btn btn-primary btn-sm">
            Send
          </button>
        )}
      </div>
    </form>
  );
}
