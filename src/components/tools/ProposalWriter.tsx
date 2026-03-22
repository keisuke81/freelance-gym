import { useState, useEffect } from 'react';
import RateLimitNotice from '../ui/RateLimitNotice';

const STORAGE_KEY = 'freelance-gym-proposal-profile';

interface Profile {
  jobType: string;
  years: number;
  skills: string;
  achievements: string;
}

const defaultProfile: Profile = {
  jobType: 'Webエンジニア',
  years: 3,
  skills: '',
  achievements: '',
};

type Tone = 'polite' | 'casual' | 'passionate';
const TONES: { value: Tone; label: string; desc: string }[] = [
  { value: 'polite', label: '丁寧', desc: '誠実・信頼感重視' },
  { value: 'casual', label: 'カジュアル', desc: '親しみやすい' },
  { value: 'passionate', label: '熱意重視', desc: '情熱・やる気重視' },
];

export default function ProposalWriter() {
  const [profile, setProfile] = useState<Profile>(defaultProfile);
  const [jobDescription, setJobDescription] = useState('');
  const [tone, setTone] = useState<Tone>('polite');
  const [proposal, setProposal] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);
  const [showProfile, setShowProfile] = useState(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setProfile(JSON.parse(saved));
        setShowProfile(false);
        setProfileSaved(true);
      }
    } catch {}
  }, []);

  const saveProfile = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    setProfileSaved(true);
    setShowProfile(false);
  };

  const generate = async () => {
    if (!jobDescription.trim()) {
      setError('案件情報を入力してください');
      return;
    }
    setError('');
    setLoading(true);
    setProposal('');

    try {
      const res = await fetch('/api/generate-proposal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobDescription, profile, tone }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? '生成に失敗しました');
        return;
      }

      setProposal(data.proposal);
    } catch {
      setError('通信エラーが発生しました。再度お試しください。');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(proposal);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* プロフィールセクション */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-lg text-gray-900">
            あなたのプロフィール
            {profileSaved && <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">保存済み</span>}
          </h2>
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="text-sm text-indigo-600 hover:underline"
          >
            {showProfile ? '折りたたむ' : '編集する'}
          </button>
        </div>

        {showProfile && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">職種</label>
                <input
                  type="text"
                  value={profile.jobType}
                  onChange={e => setProfile(p => ({ ...p, jobType: e.target.value }))}
                  placeholder="例: Webエンジニア、UIデザイナー"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  経験年数: <span className="text-indigo-600 font-bold">{profile.years}年</span>
                </label>
                <input
                  type="range"
                  value={profile.years}
                  onChange={e => setProfile(p => ({ ...p, years: Number(e.target.value) }))}
                  min={0} max={30}
                  className="w-full accent-indigo-600"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                得意分野・スキル <span className="text-gray-400 text-xs">（200文字以内）</span>
              </label>
              <textarea
                value={profile.skills}
                onChange={e => setProfile(p => ({ ...p, skills: e.target.value.slice(0, 200) }))}
                rows={2}
                placeholder="React/TypeScript歴4年。ECサイト・SaaSのフロント開発が得意。"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <p className="text-right text-xs text-gray-400 mt-1">{profile.skills.length}/200</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                主な実績 <span className="text-gray-400 text-xs">（箇条書きで3〜5個）</span>
              </label>
              <textarea
                value={profile.achievements}
                onChange={e => setProfile(p => ({ ...p, achievements: e.target.value.slice(0, 500) }))}
                rows={3}
                placeholder="・月間100万PVのメディアサイトのリファクタリング&#10;・スタートアップの0→1フロント開発（チームリード）&#10;・某ECサイトの表示速度を50%改善"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <button
              onClick={saveProfile}
              className="bg-indigo-600 text-white font-semibold px-5 py-2 rounded-lg text-sm hover:bg-indigo-700 transition-colors"
            >
              プロフィールを保存する
            </button>
          </div>
        )}
      </div>

      {/* 案件情報 */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="font-bold text-lg text-gray-900 mb-4">案件情報を貼り付け</h2>
        <textarea
          value={jobDescription}
          onChange={e => setJobDescription(e.target.value.slice(0, 2000))}
          rows={6}
          placeholder="クラウドソーシングの案件ページや求人票の内容をそのまま貼り付けてください。&#10;&#10;例:&#10;「Reactを使ったWebアプリの開発をお願いしたいです。ECサイトのフロントエンド部分で、TypeScriptが使える方を探しています。予算は月30万円程度を想定...」"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <p className="text-right text-xs text-gray-400 mt-1">{jobDescription.length}/2000</p>
      </div>

      {/* トーン選択 */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="font-bold text-lg text-gray-900 mb-4">提案文のトーン</h2>
        <div className="grid grid-cols-3 gap-3">
          {TONES.map(t => (
            <button
              key={t.value}
              onClick={() => setTone(t.value)}
              className={`p-3 rounded-xl border-2 text-center transition-colors ${
                tone === t.value
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-gray-200 hover:border-indigo-300'
              }`}
            >
              <p className={`font-semibold text-sm ${tone === t.value ? 'text-indigo-700' : 'text-gray-700'}`}>
                {t.label}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">{t.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* エラー表示 */}
      {error && (
        <RateLimitNotice message={error} />
      )}

      {/* 生成ボタン */}
      <button
        onClick={generate}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white font-bold px-6 py-4 rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed text-lg"
      >
        {loading ? (
          <>
            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            AI生成中...
          </>
        ) : (
          <>⚡ 提案文を生成する</>
        )}
      </button>

      {/* 生成結果 */}
      {proposal && (
        <div className="bg-white rounded-2xl shadow-sm border border-indigo-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-lg text-gray-900">生成された提案文</h2>
            <div className="flex gap-2">
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-1.5 text-sm bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                {copied ? '✓ コピーしました' : '📋 コピー'}
              </button>
              <button
                onClick={generate}
                className="text-sm border border-gray-300 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                🔄 再生成
              </button>
            </div>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">{proposal}</p>
          </div>
          <p className="text-xs text-gray-400 mt-3 text-right">{proposal.length}文字</p>
        </div>
      )}

      <p className="text-xs text-gray-400 text-center">
        AIが生成した文章はそのまま使用せず、必ず内容を確認・加筆してから使用してください。
        1日30回まで無料でご利用いただけます。
      </p>
    </div>
  );
}
