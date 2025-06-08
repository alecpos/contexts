export interface ChatMessage {
  role: string;
  content: string;
}

declare const process: {
  env: {
    OPENAI_API_KEY?: string;
  };
};

export async function chatCompletion(
  messages: ChatMessage[],
  model = 'gpt-4o-mini',
): Promise<any> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error('OPENAI_API_KEY not set');
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({ model, messages }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`OpenAI error: ${res.status} - ${text}`);
  }
  return res.json();
}
