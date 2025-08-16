import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { idbStorage } from '../lib/idb';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  status?: 'sending' | 'failed';
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  pinned: boolean;
  createdAt: number;
}

interface State {
  chats: Chat[];
  currentId?: string;
  create: () => string;
  setCurrent: (id: string) => void;
  remove: (id: string) => void;
  rename: (id: string, title: string) => void;
  pin: (id: string, p: boolean) => void;
  addMessage: (chatId: string, msg: Message) => void;
  updateMessage: (
    chatId: string,
    msgId: string,
    partial: Partial<Message> | ((msg: Message) => Partial<Message>)
  ) => void;
}

export const useChatStore = create<State>()(
  persist(
    (set, get) => ({
      chats: [],
      currentId: undefined,
      create: () => {
        const id = crypto.randomUUID();
        const chat: Chat = {
          id,
          title: '新会话',
          messages: [],
          pinned: false,
          createdAt: Date.now(),
        };
        set({ chats: [chat, ...get().chats], currentId: id });
        return id;
      },
      setCurrent: (id) => set({ currentId: id }),
      remove: (id) => set({ chats: get().chats.filter((c) => c.id !== id) }),
      rename: (id, title) =>
        set({
          chats: get().chats.map((c) =>
            c.id === id ? { ...c, title } : c
          ),
        }),
      pin: (id, p) =>
        set({
          chats: get().chats
            .map((c) => (c.id === id ? { ...c, pinned: p } : c))
            .sort((a, b) => Number(b.pinned) - Number(a.pinned)),
        }),
      addMessage: (chatId, msg) =>
        set({
          chats: get().chats.map((c) =>
            c.id === chatId ? { ...c, messages: [...c.messages, msg] } : c
          ),
        }),
      updateMessage: (chatId, msgId, partial) =>
        set({
          chats: get().chats.map((c) =>
            c.id === chatId
              ? {
                  ...c,
                  messages: c.messages.map((m) =>
                    m.id === msgId
                      ? {
                          ...m,
                          ...(typeof partial === 'function' ? partial(m) : partial),
                        }
                      : m
                  ),
                }
              : c
          ),
        }),
    }),
    { name: 'chats', storage: idbStorage as any }
  )
);
