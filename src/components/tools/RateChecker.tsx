import { useState, useMemo } from 'react';
import rateData from '../../data/rate-data.json';

interface JobType {
  id: string;
  label: string;
  baseHourlyRate: number;
  skills: { id: string; label: string; bonus: number }[];
  workStyles: { id: string; label: string; bonus: number }[];
}

interface RateData {
  jobTypes: JobType[];
  yearBonusTable: { maxYears: number; multiplier: number }[];
  marketPositions: { maxRate: number; label: string; color: string; advice: string }[];
}

const data = rateData as RateData;

const WORKING_HOURS_PER_MONTH = 140;

const COLOR_CLASSES: Record<string, { badge: string; text: string; bar: string }> = {
  gray:   { badge: 'bg-gray-100 text-gray-700',     text: 'text-gray-700',   bar: 'bg-gray-400' },
  blue:   { badge: 'bg-blue-100 text-blue-700',     text: 'text-blue-700',   bar: 'bg-blue-500' },
  indigo: { badge: 'bg-indigo-100 text-indigo-700', text: 'text-indigo-700', bar: 'bg-indigo-500' },
  purple: { badge: 'bg-purple-100 text-purple-700', text: 'text-purple-700', bar: 'bg-purple-500' },
  amber:  { badge: 'bg-amber-100 text-amber-700',   text: 'text-amber-700',  bar: 'bg-amber-500' },
};

export default function RateChecker() {
  const [jobTypeId, setJobTypeId] = useState(data.jobTypes[0].id);
  const [years, setYears] = useState(3);
  const [selectedSkills, setSelectedSkills] = useState<Set<string>>(new Set());
  const [workStyleId, setWorkStyleId] = useState('remote');

  const jobType = data.jobTypes.find(j => j.id === jobTypeId)!;

  const toggleSkill = (id: string) => {
    setSelectedSkills(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // 職種変更時にスキル選択をリセット
  const changeJobType = (id: string) => {
    setJobTypeId(id);
    setSelectedSkills(new Set());
    setWorkStyleId('remote');
  };

  const result = useMemo(() => {
    const yearRow = data.yearBonusTable.find(r => years <= r.maxYears) ?? data.yearBonusTable.at(-1)!;
    const skillBonus = jobType.skills
      .filter(s => selectedSkills.has(s.id))
      .reduce((sum, s) => sum + s.bonus, 0);
    const workStyle = jobType.workStyles.find(w => w.id === workStyleId);
    const workBonus = workStyle?.bonus ?? 0;

    const baseRate = jobType.baseHourlyRate * yearRow.multiplier + skillBonus + workBonus;
    const hourlyLow = Math.round(baseRate * 0.85 / 100) * 100;
    const hourlyHigh = Math.round(baseRate * 1.15 / 100) * 100;
    const monthlyLow = Math.round(hourlyLow * WORKING_HOURS_PER_MONTH / 10000) * 10000;
    const monthlyHigh = Math.round(hourlyHigh * WORKING_HOURS_PER_MONTH / 10000) * 10000;

    const midRate = (hourlyLow + hourlyHigh) / 2;
    const position = data.marketPositions.find(p => midRate <= p.maxRate) ?? data.marketPositions.at(-1)!;

    const skillEffects = jobType.skills
      .filter(s => selectedSkills.has(s.id))
      .map(s => ({ label: s.label, bonus: s.bonus }))
      .sort((a, b) => b.bonus - a.bonus);

    return { hourlyLow, hourlyHigh, monthlyLow, monthlyHigh, position, skillEffects };
  }, [jobTypeId, years, selectedSkills, workStyleId, jobType]);

  const fmt = (n: number) => `¥${n.toLocaleString('ja-JP')}`;
  const colors = COLOR_CLASSES[result.position.color] ?? COLOR_CLASSES.gray;

  return (
    <div className="space-y-6">
      {/* 入力 */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="font-bold text-lg text-gray-900 mb-5">スキル・経験を入力</h2>
        <div className="space-y-5">

          {/* 職種 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">職種</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {data.jobTypes.map(j => (
                <button
                  key={j.id}
                  onClick={() => changeJobType(j.id)}
                  className={`py-2 px-3 rounded-lg border text-sm font-medium transition-colors ${
                    jobTypeId === j.id
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                      : 'border-gray-200 text-gray-600 hover:border-indigo-300'
                  }`}
                >
                  {j.label}
                </button>
              ))}
            </div>
          </div>

          {/* 経験年数 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              経験年数: <span className="text-indigo-600 font-bold">{years}年</span>
            </label>
            <input
              type="range"
              value={years}
              onChange={e => setYears(Number(e.target.value))}
              min={0} max={15} step={1}
              className="w-full accent-indigo-600"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>未経験</span><span>5年</span><span>10年</span><span>15年+</span>
            </div>
          </div>

          {/* スキル */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              主要スキル <span className="text-gray-400 text-xs">（複数選択可）</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {jobType.skills.map(s => (
                <button
                  key={s.id}
                  onClick={() => toggleSkill(s.id)}
                  className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                    selectedSkills.has(s.id)
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                      : 'border-gray-200 text-gray-600 hover:border-indigo-300'
                  }`}
                >
                  {s.label}
                  <span className="ml-1 text-xs text-green-600">+{(s.bonus / 100 * WORKING_HOURS_PER_MONTH / 10000).toFixed(0)}万/月</span>
                </button>
              ))}
            </div>
          </div>

          {/* 稼働形態 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">稼働形態</label>
            <div className="flex gap-2 flex-wrap">
              {jobType.workStyles.map(w => (
                <button
                  key={w.id}
                  onClick={() => setWorkStyleId(w.id)}
                  className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                    workStyleId === w.id
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                      : 'border-gray-200 text-gray-600 hover:border-indigo-300'
                  }`}
                >
                  {w.label}
                  {w.bonus !== 0 && (
                    <span className={`ml-1 text-xs ${w.bonus > 0 ? 'text-green-600' : 'text-red-500'}`}>
                      {w.bonus > 0 ? '+' : ''}{w.bonus}円/h
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 診断結果 */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="font-bold text-lg text-gray-900 mb-5">診断結果</h2>

        <div className="text-center mb-6">
          <p className="text-sm text-gray-500 mb-1">適正時間単価レンジ</p>
          <p className="text-3xl font-extrabold text-indigo-600">
            {fmt(result.hourlyLow)} 〜 {fmt(result.hourlyHigh)}
            <span className="text-lg font-medium text-gray-400 ml-1">/時間</span>
          </p>
          <p className="text-sm text-gray-500 mt-2">
            月額（140h想定）: <span className="font-bold text-gray-700">{fmt(result.monthlyLow)} 〜 {fmt(result.monthlyHigh)}</span>
          </p>
        </div>

        {/* ポジション */}
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold mb-4 ${colors.badge}`}>
          <span>市場ポジション: {result.position.label}</span>
        </div>

        <p className="text-sm text-gray-600 bg-gray-50 rounded-xl p-4 leading-relaxed mb-5">
          💡 {result.position.advice}
        </p>

        {/* スキル別単価効果 */}
        {result.skillEffects.length > 0 && (
          <div>
            <h3 className="text-sm font-bold text-gray-700 mb-3">選択スキルの単価効果</h3>
            <div className="space-y-2">
              {result.skillEffects.map(s => (
                <div key={s.label} className="flex items-center gap-3 text-sm">
                  <span className="text-gray-600 w-40 flex-shrink-0">{s.label}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${colors.bar}`}
                      style={{ width: `${Math.min(100, (s.bonus / 1500) * 100)}%` }}
                    />
                  </div>
                  <span className="text-green-600 font-medium w-20 text-right">+{fmt(s.bonus)}/h</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <p className="text-xs text-gray-400 text-center">
        ※ 単価は市場データをもとにした参考値です。実際の単価はスキル・実績・案件内容によって異なります。
      </p>
    </div>
  );
}
