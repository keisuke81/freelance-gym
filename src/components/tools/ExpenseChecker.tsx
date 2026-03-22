import { useState } from 'react';
import expensesData from '../../data/expenses.json';

type Verdict = 'ok' | 'partial' | 'ng';

interface ExpenseItem {
  name: string;
  verdict: Verdict;
  explanation: string;
  ratio: string | null;
}

interface Category {
  category: string;
  emoji: string;
  items: ExpenseItem[];
}

const VERDICT_CONFIG: Record<Verdict, { label: string; color: string; bg: string; border: string }> = {
  ok: { label: '○ 経費OK', color: 'text-green-700', bg: 'bg-green-50', border: 'border-green-200' },
  partial: { label: '△ 条件付き', color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200' },
  ng: { label: '× 経費NG', color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200' },
};

const expenses = expensesData as Category[];

export default function ExpenseChecker() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<Verdict | 'all'>('all');
  const [openCategories, setOpenCategories] = useState<Set<string>>(new Set(expenses.map(c => c.category)));

  const toggleCategory = (cat: string) => {
    setOpenCategories(prev => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  const filteredExpenses = expenses.map(cat => ({
    ...cat,
    items: cat.items.filter(item => {
      const matchSearch = search === '' || item.name.toLowerCase().includes(search.toLowerCase());
      const matchFilter = filter === 'all' || item.verdict === filter;
      return matchSearch && matchFilter;
    }),
  })).filter(cat => cat.items.length > 0);

  return (
    <div className="space-y-6">
      {/* 検索・フィルター */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="キーワードで検索（例: カフェ、スーツ）"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
          <div className="flex gap-2">
            {(['all', 'ok', 'partial', 'ng'] as const).map(v => (
              <button
                key={v}
                onClick={() => setFilter(v)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === v
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {v === 'all' ? 'すべて' : VERDICT_CONFIG[v].label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 凡例 */}
      <div className="flex flex-wrap gap-3">
        {(Object.entries(VERDICT_CONFIG) as [Verdict, typeof VERDICT_CONFIG[Verdict]][]).map(([, cfg]) => (
          <div key={cfg.label} className={`flex items-center gap-1.5 text-sm font-medium ${cfg.color} ${cfg.bg} border ${cfg.border} px-3 py-1 rounded-full`}>
            {cfg.label}
          </div>
        ))}
      </div>

      {/* カテゴリ別アコーディオン */}
      {filteredExpenses.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <p className="text-4xl mb-3">🔍</p>
          <p>該当する項目が見つかりませんでした</p>
        </div>
      ) : (
        filteredExpenses.map(cat => (
          <div key={cat.category} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <button
              onClick={() => toggleCategory(cat.category)}
              className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{cat.emoji}</span>
                <span className="font-bold text-gray-900">{cat.category}</span>
                <span className="text-sm text-gray-400">（{cat.items.length}件）</span>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-5 w-5 text-gray-400 transition-transform ${openCategories.has(cat.category) ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {openCategories.has(cat.category) && (
              <div className="divide-y divide-gray-100">
                {cat.items.map(item => {
                  const cfg = VERDICT_CONFIG[item.verdict];
                  return (
                    <div key={item.name} className="px-6 py-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 text-sm">{item.name}</p>
                          <p className="text-sm text-gray-500 mt-1 leading-relaxed">{item.explanation}</p>
                          {item.ratio && (
                            <div className="mt-2 inline-flex items-center gap-1.5 text-xs bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-1 rounded-full">
                              <span>📊 按分率の目安:</span>
                              <span className="font-medium">{item.ratio}</span>
                            </div>
                          )}
                        </div>
                        <div className={`flex-shrink-0 text-xs font-bold px-3 py-1.5 rounded-full border ${cfg.color} ${cfg.bg} ${cfg.border}`}>
                          {cfg.label}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))
      )}

      <p className="text-xs text-gray-400 text-center">
        ※ 判定は一般的な基準に基づく参考情報です。最終的な判断は税理士にご相談ください。
      </p>
    </div>
  );
}
