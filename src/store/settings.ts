import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { testConnection } from '../lib/chatApi';
import toast from 'react-hot-toast';

export interface Settings {
  provider: 'openai' | 'custom';
  apiBase: string;
  apiKey: string;
  model: string;
  temperature: number;
  maxTokens: number;
}

interface State {
  settings: Settings;
  setSettings: (s: Partial<Settings>) => void;
  check: () => Promise<void>;
}

const defaultSettings: Settings = {
  provider: 'openai',
  apiBase: 'https://api.openai.com/v1',
  apiKey: '',
  model: 'gpt-3.5-turbo',
  temperature: 0.7,
  maxTokens: 1024,
};

export const useSettingsStore = create<State>()(
  persist(
    (set, get) => ({
      settings: defaultSettings,
      setSettings: (s) => set((st) => ({ settings: { ...st.settings, ...s } })),
      check: async () => {
        const ok = await testConnection(get().settings);
        toast[ok ? 'success' : 'error'](ok ? '连接成功' : '连接失败');
      },
    }),
    { name: 'settings', storage: createJSONStorage(() => localStorage) }
  )
);
