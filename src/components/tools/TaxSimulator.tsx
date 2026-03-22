import { useState, useMemo } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// ---- 計算ロジック ----

const INCOME_TAX_BRACKETS = [
  { limit: 1_950_000, rate: 0.05, deduction: 0 },
  { limit: 3_300_000, rate: 0.10, deduction: 97_500 },
  { limit: 6_950_000, rate: 0.20, deduction: 427_500 },
  { limit: 9_000_000, rate: 0.23, deduction: 636_000 },
  { limit: 18_000_000, rate: 0.33, deduction: 1_536_000 },
  { limit: 40_000_000, rate: 0.40, deduction: 2_796_000 },
  { limit: Infinity, rate: 0.45, deduction: 4_796_000 },
];

function calcIncomeTax(taxableIncome: number): number {
  if (taxableIncome <= 0) return 0;
  for (const bracket of INCOME_TAX_BRACKETS) {
    if (taxableIncome <= bracket.limit) {
      return Math.max(0, taxableIncome * bracket.rate - bracket.deduction);
    }
  }
  return 0;
}

function calcNationalHealthInsurance(income: number): number {
  // 概算: 所得割 9.27% + 均等割 45,000円（全国平均）
  if (income <= 0) return 45_000;
  const premium = income * 0.0927 + 45_000;
  return Math.min(premium, 1_040_000); // 上限104万
}

interface CalcResult {
  income: number;        // 所得
  taxableIncome: number; // 課税所得
  incomeTax: number;
  residentTax: number;
  healthInsurance: number;
  pension: number;
  businessTax: number;
  totalTax: number;
  takeHome: number;
  effectiveRate: number;
}

function calculate(params: {
  revenue: number;
  expenseRate: number;
  blueReturn: 'blue65' | 'blue10' | 'white';
  spouseDeduction: boolean;
  dependents: number;
  ideco: number;
  kyosai: number;
}): CalcResult {
  const { revenue, expenseRate, blueReturn, spouseDeduction, dependents, ideco, kyosai } = params;

  const expense = revenue * (expenseRate / 100);
  const blueDeduction = blueReturn === 'blue65' ? 650_000 : blueReturn === 'blue10' ? 100_000 : 0;

  // 所得
  const income = Math.max(0, revenue - expense - blueDeduction);

  // 国民年金 (月額16,980円×12)
  const pension = 16_980 * 12; // 203,760円

  // 国民健康保険（概算）
  const healthInsurance = calcNationalHealthInsurance(income);

  // 社会保険料控除
  const socialInsDeduction = pension + healthInsurance;

  // 基礎控除
  const basicDeduction = 480_000;

  // 配偶者控除
  const spouseDeductionAmount = spouseDeduction ? 380_000 : 0;

  // 扶養控除 (一般扶養 1人38万)
  const dependentDeduction = dependents * 380_000;

  // iDeCo・小規模企業共済控除
  const idecoDeduction = ideco * 12;
  const kyosaiDeduction = kyosai * 12;

  // 課税所得
  const taxableIncome = Math.max(
    0,
    income - basicDeduction - socialInsDeduction - spouseDeductionAmount - dependentDeduction - idecoDeduction - kyosaiDeduction
  );

  // 所得税（復興特別所得税 2.1% 含む）
  const baseIncomeTax = calcIncomeTax(taxableIncome);
  const incomeTax = Math.floor(baseIncomeTax * 1.021);

  // 住民税（均等割5,000円 + 所得割10%）
  const residentTax = Math.max(5_000, Math.floor(taxableIncome * 0.10 + 5_000));

  // 個人事業税（所得290万超の場合 5%）
  const businessTax = income > 2_900_000 ? Math.floor((income - 2_900_000) * 0.05) : 0;

  const totalTax = incomeTax + residentTax + healthInsurance + pension + businessTax;
  const takeHome = Math.max(0, revenue - expense - totalTax);
  const effectiveRate = revenue > 0 ? (totalTax / revenue) * 100 : 0;

  return {
    income,
    taxableIncome,
    incomeTax,
    residentTax,
    healthInsurance,
    pension,
    businessTax,
    totalTax,
    takeHome,
    effectiveRate,
  };
}

// ---- UI ----

const fmt = (n: number) =>
  n.toLocaleString('ja-JP', { style: 'currency', currency: 'JPY', maximumFractionDigits: 0 });

const COLORS = ['#6366f1', '#f59e0b', '#10b981', '#3b82f6', '#ef4444'];

export default function TaxSimulator() {
  const [revenue, setRevenue] = useState(5_000_000);
  const [expenseRate, setExpenseRate] = useState(20);
  const [blueReturn, setBlueReturn] = useState<'blue65' | 'blue10' | 'white'>('blue65');
  const [spouseDeduction, setSpouseDeduction] = useState(false);
  const [dependents, setDependents] = useState(0);
  const [ideco, setIdeco] = useState(0);
  const [kyosai, setKyosai] = useState(0);

  const result = useMemo(
    () => calculate({ revenue, expenseRate, blueReturn, spouseDeduction, dependents, ideco, kyosai }),
    [revenue, expenseRate, blueReturn, spouseDeduction, dependents, ideco, kyosai]
  );

  const chartData = [
    { name: '所得税', value: result.incomeTax },
    { name: '住民税', value: result.residentTax },
    { name: '国保', value: result.healthInsurance },
    { name: '国民年金', value: result.pension },
    { name: '個人事業税', value: result.businessTax },
  ].filter(d => d.value > 0);

  return (
    <div className="space-y-8">
      {/* 入力フォーム */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="font-bold text-lg text-gray-900 mb-6">収入・条件を入力</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">年間売上（収入）</label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-gray-400 text-sm">¥</span>
              <input
                type="number"
                value={revenue}
                onChange={e => setRevenue(Number(e.target.value))}
                step={100000}
                min={0}
                className="w-full border border-gray-300 rounded-lg pl-7 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              経費率: <span className="text-indigo-600 font-bold">{expenseRate}%</span>
            </label>
            <input
              type="range"
              value={expenseRate}
              onChange={e => setExpenseRate(Number(e.target.value))}
              min={0}
              max={80}
              step={5}
              className="w-full accent-indigo-600"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>0%</span><span>80%</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">青色申告</label>
            <select
              value={blueReturn}
              onChange={e => setBlueReturn(e.target.value as typeof blueReturn)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              <option value="blue65">青色申告（65万控除）</option>
              <option value="blue10">青色申告（10万控除）</option>
              <option value="white">白色申告</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">扶養人数</label>
            <select
              value={dependents}
              onChange={e => setDependents(Number(e.target.value))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              {[0, 1, 2, 3, 4, 5].map(n => (
                <option key={n} value={n}>{n}人</option>
              ))}
            </select>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={spouseDeduction}
                onChange={e => setSpouseDeduction(e.target.checked)}
                className="accent-indigo-600 w-4 h-4"
              />
              配偶者控除あり（38万円）
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">iDeCo掛金（月額）</label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-gray-400 text-sm">¥</span>
              <input
                type="number"
                value={ideco}
                onChange={e => setIdeco(Number(e.target.value))}
                step={1000}
                min={0}
                max={68000}
                className="w-full border border-gray-300 rounded-lg pl-7 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">小規模企業共済掛金（月額）</label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-gray-400 text-sm">¥</span>
              <input
                type="number"
                value={kyosai}
                onChange={e => setKyosai(Number(e.target.value))}
                step={1000}
                min={0}
                max={70000}
                className="w-full border border-gray-300 rounded-lg pl-7 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 結果 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 数値 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-bold text-lg text-gray-900 mb-4">計算結果</h2>
          <div className="space-y-3">
            {[
              { label: '年間売上', value: fmt(revenue), muted: false },
              { label: '経費（概算）', value: `- ${fmt(revenue * (expenseRate / 100))}`, muted: true },
              { label: '所得', value: fmt(result.income), muted: false },
              { label: '─ 所得税', value: `- ${fmt(result.incomeTax)}`, muted: true },
              { label: '─ 住民税', value: `- ${fmt(result.residentTax)}`, muted: true },
              { label: '─ 国民健康保険', value: `- ${fmt(result.healthInsurance)}`, muted: true },
              { label: '─ 国民年金', value: `- ${fmt(result.pension)}`, muted: true },
              ...(result.businessTax > 0
                ? [{ label: '─ 個人事業税', value: `- ${fmt(result.businessTax)}`, muted: true }]
                : []),
            ].map(row => (
              <div key={row.label} className="flex justify-between text-sm">
                <span className={row.muted ? 'text-gray-400' : 'text-gray-700'}>{row.label}</span>
                <span className={row.muted ? 'text-gray-400' : 'font-medium text-gray-900'}>{row.value}</span>
              </div>
            ))}
            <div className="border-t border-gray-200 pt-3 mt-3">
              <div className="flex justify-between items-center">
                <span className="font-bold text-gray-900">手取り額</span>
                <span className="text-2xl font-bold text-indigo-600">{fmt(result.takeHome)}</span>
              </div>
              <div className="flex justify-between text-sm mt-2">
                <span className="text-gray-500">実質税負担率</span>
                <span className="font-medium text-gray-700">{result.effectiveRate.toFixed(1)}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* グラフ */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-bold text-lg text-gray-900 mb-4">税負担の内訳</h2>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="45%"
                  outerRadius={90}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {chartData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => fmt(value)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-400 text-sm text-center py-10">売上を入力してください</p>
          )}
        </div>
      </div>

      <p className="text-xs text-gray-400 text-center">
        ※ 計算結果は概算です。実際の税額は個人の状況により異なります。詳細は税理士にご相談ください。
      </p>
    </div>
  );
}
