import type { Message } from '../store/chats';
import type { Settings } from '../store/settings';

/**
 * 模拟聊天接口；请在此处替换成真实请求。
 */
export async function chatCompletion(
  settings: Settings,
  messages: Message[],
  onMessage: (delta: string) => void,
  signal?: AbortSignal
) {
  const last = messages[messages.length - 1]?.content || '';
  for (const w of last.split(' ')) {
    if (signal?.aborted) break;
    await new Promise((r) => setTimeout(r, 200));
    onMessage(w + ' ');
  }
}

/** 测试连接示例，真实环境中应调用后端接口验证。 */
export async function testConnection(_settings: Settings): Promise<boolean> {
  await new Promise((r) => setTimeout(r, 300));
  return true;
}
