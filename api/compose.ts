// Vercel 함수 — HDS Studio 프롬프트 모드. Anthropic API로 요청을 넘기고 응답 텍스트만 돌려준다.
// 필요한 환경 변수: ANTHROPIC_API_KEY (Vercel → Settings → Environment Variables). 선택: STUDIO_MODEL
type Req = { method?: string; body?: unknown };
type Res = { status: (n: number) => Res; json: (b: unknown) => void };

export default async function handler(req: Req, res: Res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST만 받아요' });
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return res.status(501).json({ error: '프롬프트 모드가 꺼져 있어요. Vercel 환경 변수에 ANTHROPIC_API_KEY를 넣으면 켜져요. 직접 조합은 그대로 쓸 수 있어요.' });
  let body: { system?: string; user?: string };
  try { body = (typeof req.body === 'string' ? JSON.parse(req.body) : req.body) as typeof body; }
  catch { return res.status(400).json({ error: '요청 형식을 읽지 못했어요.' }); }
  const system = String(body?.system ?? '');
  const user = String(body?.user ?? '');
  if (system.length > 60000 || user.length > 40000) return res.status(400).json({ error: '화면이 너무 커요. 컴포넌트 단위로 나누어 요청해주세요.' });
  if (!user.trim()) return res.status(400).json({ error: '요청 문장이 비어 있어요' });
  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({ model: process.env.STUDIO_MODEL || 'claude-sonnet-5-5', max_tokens: 6000, system, messages: [{ role: 'user', content: user }] }),
    });
    const data = (await r.json()) as { stop_reason?: string; content?: { type: string; text?: string }[]; error?: { message?: string } };
    if (!r.ok) return res.status(502).json({ error: `AI 호출 실패: ${data.error?.message ?? r.status}` });
    if (data.stop_reason === 'max_tokens') return res.status(502).json({ error: '생성 결과가 길어서 중단됐어요. 컴포넌트 하나씩 요청해주세요. 기존 화면은 유지돼요.' });
    const text = (data.content ?? []).filter((c) => c.type === 'text').map((c) => c.text).join('');
    return res.status(200).json({ text });
  } catch (e) {
    return res.status(502).json({ error: `AI 호출 실패: ${(e as Error).message}` });
  }
}
