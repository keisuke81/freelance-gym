export interface ProposalInput {
  jobDescription: string;
  profile: {
    jobType: string;
    years: number;
    skills: string;
    achievements: string;
  };
  tone: 'polite' | 'casual' | 'passionate';
}

export function validateProposalInput(body: unknown): ProposalInput {
  if (!body || typeof body !== 'object') {
    throw new Error('リクエストボディが不正です');
  }

  const b = body as Record<string, unknown>;

  const jobDescription = String(b.jobDescription ?? '').trim();
  if (jobDescription.length < 10) {
    throw new Error('案件情報は10文字以上入力してください');
  }
  if (jobDescription.length > 2000) {
    throw new Error('案件情報は2,000文字以内で入力してください');
  }

  // プロンプトインジェクション検出
  const injectionPatterns = [
    /ignore\s+(previous|all|above)/i,
    /system\s*:/i,
    /\[INST\]/i,
    /<\|im_start\|>/i,
  ];
  for (const pattern of injectionPatterns) {
    if (pattern.test(jobDescription)) {
      throw new Error('不正な入力が検出されました');
    }
  }

  const profile = b.profile as Record<string, unknown> | undefined;
  if (!profile) throw new Error('プロフィール情報が必要です');

  const tone = String(b.tone ?? 'polite');
  if (!['polite', 'casual', 'passionate'].includes(tone)) {
    throw new Error('トーンの値が不正です');
  }

  return {
    jobDescription,
    profile: {
      jobType: String(profile.jobType ?? '').slice(0, 50),
      years: Math.max(0, Math.min(50, Number(profile.years ?? 0))),
      skills: String(profile.skills ?? '').slice(0, 200),
      achievements: String(profile.achievements ?? '').slice(0, 500),
    },
    tone: tone as ProposalInput['tone'],
  };
}
