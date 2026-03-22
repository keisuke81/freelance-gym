import { useState } from 'react';
import templatesData from '../../data/templates.json';

interface Field {
  id: string;
  label: string;
  type: 'text' | 'textarea';
  placeholder: string;
}

interface Template {
  id: string;
  title: string;
  emoji: string;
  description: string;
  fields: Field[];
  outputTemplate: string;
}

const templates = templatesData as Template[];

// チェックリスト項目
const CONTRACT_CHECKLIST = [
  { id: 1, text: '契約書・発注書が書面（メール可）で存在する', critical: true },
  { id: 2, text: '報酬額が明記されている', critical: true },
  { id: 3, text: '支払い期日が明記されている', critical: true },
  { id: 4, text: '納品物・成果物の定義が明確', critical: true },
  { id: 5, text: '修正対応の範囲・回数が定まっている', critical: true },
  { id: 6, text: '著作権・知的財産権の帰属が明確', critical: false },
  { id: 7, text: '秘密保持（NDA）の要件を把握している', critical: false },
  { id: 8, text: 'キャンセル時の報酬・違約金ルールがある', critical: false },
  { id: 9, text: 'クライアントの評判・支払い実績を確認した', critical: false },
  { id: 10, text: '自分のスケジュールに無理がない', critical: false },
];

// テンプレート文字列を値で置換
function applyTemplate(template: string, values: Record<string, string>): string {
  let result = template.replace('{{date}}', new Date().toLocaleDateString('ja-JP'));
  for (const [key, value] of Object.entries(values)) {
    result = result.replaceAll(`{{${key}}}`, value || `（${key}未入力）`);
  }
  return result;
}

// 見積書の行アイテム
interface EstimateItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

const fmt = (n: number) => `¥${n.toLocaleString('ja-JP')}`;

function EstimateForm({ template }: { template: Template }) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [items, setItems] = useState<EstimateItem[]>([
    { id: '1', description: '', quantity: 1, unitPrice: 0 },
  ]);
  const [copied, setCopied] = useState(false);

  const addItem = () => setItems(prev => [...prev, { id: Date.now().toString(), description: '', quantity: 1, unitPrice: 0 }]);
  const removeItem = (id: string) => setItems(prev => prev.filter(i => i.id !== id));
  const updateItem = (id: string, field: keyof EstimateItem, value: string | number) =>
    setItems(prev => prev.map(i => i.id === id ? { ...i, [field]: value } : i));

  const subtotal = items.reduce((s, i) => s + i.quantity * i.unitPrice, 0);
  const tax = Math.floor(subtotal * 0.1);
  const total = subtotal + tax;

  const generateText = () => {
    const itemLines = items.map(i => `- ${i.description || '（未入力）'}: ${i.quantity}個 × ${fmt(i.unitPrice)} = ${fmt(i.quantity * i.unitPrice)}`).join('\n');
    return `【見積書】
件名: ${values.projectName || ''}
提出者: ${values.fromName || ''}
提出先: ${values.toName || ''}
有効期限: ${values.validUntil || ''}

【内訳】
${itemLines}

小計: ${fmt(subtotal)}
消費税（10%）: ${fmt(tax)}
合計: ${fmt(total)}

【備考】
${values.notes || ''}`;
  };

  const copyText = async () => {
    await navigator.clipboard.writeText(generateText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-5">
      {template.fields.map(field => (
        <div key={field.id}>
          <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
          {field.type === 'textarea' ? (
            <textarea rows={2} value={values[field.id] ?? ''} onChange={e => setValues(p => ({ ...p, [field.id]: e.target.value }))} placeholder={field.placeholder} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
          ) : (
            <input type="text" value={values[field.id] ?? ''} onChange={e => setValues(p => ({ ...p, [field.id]: e.target.value }))} placeholder={field.placeholder} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
          )}
        </div>
      ))}

      {/* 明細 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">作業項目</label>
        <div className="space-y-2">
          {items.map(item => (
            <div key={item.id} className="grid grid-cols-12 gap-2 items-center">
              <div className="col-span-6">
                <input type="text" placeholder="作業内容" value={item.description} onChange={e => updateItem(item.id, 'description', e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
              </div>
              <div className="col-span-2">
                <input type="number" placeholder="数量" value={item.quantity} onChange={e => updateItem(item.id, 'quantity', Number(e.target.value))} min={1} className="w-full border border-gray-300 rounded-lg px-2 py-2 text-sm text-right focus:outline-none focus:ring-2 focus:ring-indigo-400" />
              </div>
              <div className="col-span-3">
                <input type="number" placeholder="単価" value={item.unitPrice} onChange={e => updateItem(item.id, 'unitPrice', Number(e.target.value))} step={1000} className="w-full border border-gray-300 rounded-lg px-2 py-2 text-sm text-right focus:outline-none focus:ring-2 focus:ring-indigo-400" />
              </div>
              <div className="col-span-1 text-center">
                {items.length > 1 && (
                  <button onClick={() => removeItem(item.id)} className="text-gray-400 hover:text-red-500">×</button>
                )}
              </div>
            </div>
          ))}
        </div>
        <button onClick={addItem} className="mt-2 text-sm text-indigo-600 hover:underline">+ 行を追加</button>
        <div className="mt-3 text-right text-sm space-y-1">
          <p className="text-gray-500">小計: {fmt(subtotal)}</p>
          <p className="text-gray-500">消費税（10%）: {fmt(tax)}</p>
          <p className="font-bold text-gray-900 text-lg">合計: {fmt(total)}</p>
        </div>
      </div>

      <button onClick={copyText} className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white font-semibold px-5 py-3 rounded-xl hover:bg-indigo-700 transition-colors">
        {copied ? '✓ コピーしました' : '📋 テキストをコピー'}
      </button>
    </div>
  );
}

function ChecklistForm() {
  const [checked, setChecked] = useState<Set<number>>(new Set());

  const toggle = (id: number) => {
    setChecked(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const criticalItems = CONTRACT_CHECKLIST.filter(i => i.critical);
  const allCriticalChecked = criticalItems.every(i => checked.has(i.id));
  const checkedCount = checked.size;
  const totalCount = CONTRACT_CHECKLIST.length;

  return (
    <div className="space-y-4">
      <div className={`rounded-xl p-4 text-center ${allCriticalChecked ? 'bg-green-50 border border-green-200' : 'bg-amber-50 border border-amber-200'}`}>
        <p className={`font-bold text-lg ${allCriticalChecked ? 'text-green-700' : 'text-amber-700'}`}>
          {checkedCount}/{totalCount} 項目確認済み
        </p>
        {!allCriticalChecked && (
          <p className="text-amber-600 text-sm mt-1">⚠️ 必須項目（赤ラベル）を必ず確認してください</p>
        )}
        {allCriticalChecked && checkedCount === totalCount && (
          <p className="text-green-600 text-sm mt-1">✅ 全項目OK！安心して受注できます</p>
        )}
      </div>

      <div className="space-y-2">
        {CONTRACT_CHECKLIST.map(item => (
          <label key={item.id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 cursor-pointer">
            <input
              type="checkbox"
              checked={checked.has(item.id)}
              onChange={() => toggle(item.id)}
              className="accent-indigo-600 w-5 h-5 mt-0.5 flex-shrink-0"
            />
            <div className="flex-1">
              <span className="text-sm text-gray-800">{item.text}</span>
              {item.critical && (
                <span className="ml-2 text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full">必須</span>
              )}
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}

function TextForm({ template }: { template: Template }) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);

  const generate = () => {
    setResult(applyTemplate(template.outputTemplate, values));
  };

  const copy = async () => {
    await navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      {template.fields.map(field => (
        <div key={field.id}>
          <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
          {field.type === 'textarea' ? (
            <textarea rows={3} value={values[field.id] ?? ''} onChange={e => setValues(p => ({ ...p, [field.id]: e.target.value }))} placeholder={field.placeholder} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
          ) : (
            <input type="text" value={values[field.id] ?? ''} onChange={e => setValues(p => ({ ...p, [field.id]: e.target.value }))} placeholder={field.placeholder} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
          )}
        </div>
      ))}

      <button onClick={generate} className="w-full bg-indigo-600 text-white font-semibold px-5 py-3 rounded-xl hover:bg-indigo-700 transition-colors">
        テンプレートを生成
      </button>

      {result && (
        <div className="bg-gray-50 rounded-xl p-4">
          <pre className="text-sm text-gray-800 whitespace-pre-wrap font-sans leading-relaxed">{result}</pre>
          <button onClick={copy} className="mt-3 flex items-center gap-1.5 text-sm bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
            {copied ? '✓ コピーしました' : '📋 コピー'}
          </button>
        </div>
      )}
    </div>
  );
}

function RequirementsForm({ template }: { template: Template }) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);

  const generate = () => setResult(applyTemplate(template.outputTemplate, values));
  const copy = async () => {
    await navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      {template.fields.map(field => (
        <div key={field.id}>
          <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
          {field.type === 'textarea' ? (
            <textarea rows={3} value={values[field.id] ?? ''} onChange={e => setValues(p => ({ ...p, [field.id]: e.target.value }))} placeholder={field.placeholder} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
          ) : (
            <input type="text" value={values[field.id] ?? ''} onChange={e => setValues(p => ({ ...p, [field.id]: e.target.value }))} placeholder={field.placeholder} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
          )}
        </div>
      ))}

      <button onClick={generate} className="w-full bg-indigo-600 text-white font-semibold px-5 py-3 rounded-xl hover:bg-indigo-700 transition-colors">
        確認シートを生成
      </button>

      {result && (
        <div className="bg-gray-50 rounded-xl p-4">
          <pre className="text-sm text-gray-800 whitespace-pre-wrap font-sans leading-relaxed">{result}</pre>
          <button onClick={copy} className="mt-3 flex items-center gap-1.5 text-sm bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
            {copied ? '✓ コピーしました' : '📋 コピー'}
          </button>
        </div>
      )}
    </div>
  );
}

export default function ClientTemplates() {
  const [activeId, setActiveId] = useState(templates[0].id);
  const active = templates.find(t => t.id === activeId)!;

  const renderForm = () => {
    if (active.id === 'requirements') return <RequirementsForm template={active} />;
    if (active.id === 'estimate') return <EstimateForm template={active} />;
    if (active.id === 'contract-check') return <ChecklistForm />;
    return <TextForm template={active} />;
  };

  return (
    <div className="space-y-6">
      {/* テンプレート選択 */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col sm:flex-row gap-2">
          {templates.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveId(t.id)}
              className={`flex-1 flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                activeId === t.id
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <span>{t.emoji}</span>
              <span>{t.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 選択中テンプレートの説明 */}
      <div className="bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-3">
        <p className="text-sm text-indigo-700">
          <span className="font-bold">{active.emoji} {active.title}</span>
          <span className="ml-2 text-indigo-600">{active.description}</span>
        </p>
      </div>

      {/* フォーム */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        {renderForm()}
      </div>
    </div>
  );
}
