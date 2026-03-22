import Anthropic from '@anthropic-ai/sdk';
import '@upstash/ratelimit';
import '@upstash/redis';

const anthropic = new Anthropic({
  apiKey: undefined                                 
});
const MODEL = "claude-haiku-4-5-20251001";
const MAX_OUTPUT_TOKENS = 1024;

function getRatelimiters() {
  return null;
}
async function checkRateLimit(ip) {
  const limiters = getRatelimiters();
  if (!limiters) return { ok: true };
  const { ratelimitPerMinute: ratelimitPerMinute2, ratelimitPerHour: ratelimitPerHour2, ratelimitPerDay: ratelimitPerDay2 } = limiters;
  const [min, hr, day] = await Promise.all([
    ratelimitPerMinute2.limit(ip),
    ratelimitPerHour2.limit(ip),
    ratelimitPerDay2.limit(ip)
  ]);
  if (!min.success) return { ok: false, reason: "minute" };
  if (!hr.success) return { ok: false, reason: "hour" };
  if (!day.success) return { ok: false, reason: "day" };
  return { ok: true };
}

function validateProposalInput(body) {
  if (!body || typeof body !== "object") {
    throw new Error("リクエストボディが不正です");
  }
  const b = body;
  const jobDescription = String(b.jobDescription ?? "").trim();
  if (jobDescription.length < 10) {
    throw new Error("案件情報は10文字以上入力してください");
  }
  if (jobDescription.length > 2e3) {
    throw new Error("案件情報は2,000文字以内で入力してください");
  }
  const injectionPatterns = [
    /ignore\s+(previous|all|above)/i,
    /system\s*:/i,
    /\[INST\]/i,
    /<\|im_start\|>/i
  ];
  for (const pattern of injectionPatterns) {
    if (pattern.test(jobDescription)) {
      throw new Error("不正な入力が検出されました");
    }
  }
  const profile = b.profile;
  if (!profile) throw new Error("プロフィール情報が必要です");
  const tone = String(b.tone ?? "polite");
  if (!["polite", "casual", "passionate"].includes(tone)) {
    throw new Error("トーンの値が不正です");
  }
  return {
    jobDescription,
    profile: {
      jobType: String(profile.jobType ?? "").slice(0, 50),
      years: Math.max(0, Math.min(50, Number(profile.years ?? 0))),
      skills: String(profile.skills ?? "").slice(0, 200),
      achievements: String(profile.achievements ?? "").slice(0, 500)
    },
    tone
  };
}

const prerender = false;
const TONE_LABELS = {
  polite: "丁寧・誠実",
  casual: "カジュアル・親しみやすい",
  passionate: "熱意・情熱重視"
};
const POST = async ({ request }) => {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? request.headers.get("x-real-ip") ?? "anonymous";
  const rateResult = await checkRateLimit(ip);
  if (!rateResult.ok) {
    const messages = {
      minute: "少し待ってから再度お試しください（1分あたり3回まで）",
      hour: "1時間あたりの上限に達しました。しばらくお待ちください。",
      day: "本日の上限に達しました。明日またどうぞ。",
      site: "アクセス集中のため一時停止中です。しばらくお待ちください。"
    };
    return new Response(
      JSON.stringify({ error: messages[rateResult.reason] }),
      { status: 429, headers: { "Content-Type": "application/json" } }
    );
  }
  let input;
  try {
    const body = await request.json();
    input = validateProposalInput(body);
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 400, headers: { "Content-Type": "application/json" } }
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
      messages: [{ role: "user", content: prompt }]
    });
    const text = message.content.filter((c) => c.type === "text").map((c) => c.text).join("").slice(0, 1500);
    return new Response(
      JSON.stringify({ proposal: text }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Anthropic API error:", err);
    return new Response(
      JSON.stringify({ error: "AI生成中にエラーが発生しました。しばらくお待ちください。" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
