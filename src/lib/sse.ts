export async function stream(
  url: string,
  body: any,
  onMessage: (chunk: string) => void,
  signal?: AbortSignal
) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal,
  });

  if (!res.body) {
    onMessage(await res.text());
    return;
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    onMessage(decoder.decode(value));
  }
}
