import type { APIRoute } from 'astro';
import { anthropic, MODEL, MAX_OUTPUT_TOKENS } from '../../lib/anthropic';
import { checkRateLimit } from '../../lib/ratelimit';
import { validateProposalInput } from '../../lib/validation';

export const prerender = false;

const TONE_LABELS = {
  polite: '丁寧・誠実',
  casual: 'カジュアル・親しみやすい',
  passionate: '熱意・情熱重視',
};

export const POST: APIRoute = async ({ request }) => {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip') ??
    'anonymous';

  // レート制限チェック
  const rateResult = await checkRateLimit(ip);
  if (!rateResult.ok) {
    const messages: Record<string, string> = {
      minute: '少し待ってから再度お試しください（1分あたり3回まで）',
      hour: '1時間あたりの上限に達しました。しばらくお待ちください。',
      day: '本日の上限に達しました。明日またどうぞ。',
      site: 'アクセス集中のため一時停止中です。しばらくお待ちください。',
    };
    return new Response(
      JSON.stringify({ error: messages[rateResult.reason] }),
      { status: 429, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // 入力バリデーション
  let input;
  try {
    const body = await request.json();
    input = validateProposalInput(body);
  } catch (err) {
    return new Response(
      JSON.stringify({ error: (err as Error).message }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const { jobDescription, profile, tone } = input;

  const prompt = `あなたはフリーランスの提案文作成の専門家です。
以下の情報をもとに、クラウドソーシングや直営業向けの提案文を生成してください。

【フリーランスのプロフィール】
職種: ${profile.jobType}
経験年数: ${profile.years}年
得意分野・スキル: ${profile.skills}
主な実績: ${profile.achievements}

【案件情報】
${jobDescription}

【トーン】
${TONE_LABELS[tone]}

【生成ルール】
- 300〜500文字で書く
- 冒頭で案件への理解・共感を示す
- 自分の経験・実績を具体的に結びつける
- 次のアクション（返信・相談）を促すクロージング
- 過度な敬語・自己PRの羅列は避ける
- 提案文のみを出力する（前置き・解説不要）`;

  try {
    const message = await anthropic.messages.create({
      model: MODEL,
      max_tokens: MAX_OUTPUT_TOKENS,
      messages: [{ role: 'user', content: prompt }],
    });

    const text = message.content
      .filter(c => c.type === 'text')
      .map(c => c.text)
      .join('')
      .slice(0, 1500); // 最大1,500文字

    return new Response(
      JSON.stringify({ proposal: text }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('Anthropic API error:', err);
    return new Response(
      JSON.stringify({ error: 'AI生成中にエラーが発生しました。しばらくお待ちください。' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
