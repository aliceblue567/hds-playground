// Vercel 함수 — HDS Studio 프롬프트 모드. Anthropic API로 요청을 넘기고 응답 텍스트만 돌려준다.
// 필요한 환경 변수: ANTHROPIC_API_KEY (Vercel → Settings → Environment Variables). 선택: STUDIO_MODEL
type Req = { method?: string; body?: unknown };
type Res = { status: (n: number) => Res; json: (b: unknown) => void };

export default async function handler(req: Req, res: Res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST만 받아요' });
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return res.status(501).json({ error: '프롬프트 모드가 꺼져 있어요. Vercel 환경 변수에 ANTHROPIC_API_KEY를 넣으면 켜져요. 직접 조합은 그대로 쓸 수 있어요.' });
  const body = (typeof req.body === 'string' ? JSON.parse(req.body) : req.body) as { system?: string; user?: string };
  const system = String(body?.system ?? '').slice(0, 60000);
  const user = String(body?.user ?? '').slice(0, 20000);
  if (!user.trim()) return res.status(400).json({ error: '요청 문장이 비어 있어요' });
  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({ model: process.env.STUDIO_MODEL || 'claude-sonnet-5-5', max_tokens: 4000, system, messages: [{ role: 'user', content: user }] }),
    });
    const data = (await r.json()) as { content?: { type: string; text?: string }[]; error?: { message?: string } };
    if (!r.ok) return res.status(502).json({ error: `AI 호출 실패: ${data.error?.message ?? r.status}` });
    const text = (data.content ?? []).filter((c) => c.type === 'text').map((c) => c.text).join('');
    return res.status(200).json({ text });
  } catch (e) {
    return res.status(502).json({ error: `AI 호출 실패: ${(e as Error).message}` });
  }
}
