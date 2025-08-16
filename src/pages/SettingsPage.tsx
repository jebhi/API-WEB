import { useSettingsStore } from '../store/settings';
import { useNavigate } from 'react-router-dom';

export default function SettingsPage() {
  const { settings, setSettings, check } = useSettingsStore();
  const navigate = useNavigate();

  return (
    <div className="p-4 max-w-xl mx-auto space-y-4">
      <h2 className="text-xl font-bold">Provider 设置</h2>
      <div className="space-y-2">
        <select
          className="select select-bordered w-full"
          value={settings.provider}
          onChange={(e) => setSettings({ provider: e.target.value as any })}
        >
          <option value="openai">OpenAI</option>
          <option value="custom">Custom</option>
        </select>

        <input
          className="input input-bordered w-full"
          placeholder="API Base"
          value={settings.apiBase}
          onChange={(e) => setSettings({ apiBase: e.target.value })}
        />

        <input
          className="input input-bordered w-full"
          placeholder="API Key"
          value={settings.apiKey}
          onChange={(e) => setSettings({ apiKey: e.target.value })}
        />

        <input
          className="input input-bordered w-full"
          placeholder="Model"
          value={settings.model}
          onChange={(e) => setSettings({ model: e.target.value })}
        />

        <label className="flex items-center gap-2">
          temperature
          <input
            type="number"
            className="input input-bordered w-full"
            value={settings.temperature}
            onChange={(e) =>
              setSettings({ temperature: Number(e.target.value) })
            }
          />
        </label>

        <label className="flex items-center gap-2">
          maxTokens
          <input
            type="number"
            className="input input-bordered w-full"
            value={settings.maxTokens}
            onChange={(e) =>
              setSettings({ maxTokens: Number(e.target.value) })
            }
          />
        </label>

        <button className="btn btn-primary" onClick={check}>
          测试连接
        </button>
      </div>

      <button className="btn btn-secondary" onClick={() => navigate(-1)}>
        返回
      </button>
    </div>
  );
}
