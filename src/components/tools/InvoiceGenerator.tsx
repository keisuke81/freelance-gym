import { useState, useEffect, useRef } from 'react';

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate: 10 | 8;
}

interface InvoiceData {
  // 請求元
  fromName: string;
  fromAddress: string;
  fromPhone: string;
  fromEmail: string;
  fromBank: string;
  fromInvoiceNumber: string;
  // 請求先
  toCompany: string;
  toContact: string;
  // 日付
  issueDate: string;
  dueDate: string;
  invoiceNo: string;
  // 明細
  items: LineItem[];
  // 備考
  notes: string;
}

const STORAGE_KEY = 'freelance-gym-invoice-sender';

const defaultItem = (): LineItem => ({
  id: crypto.randomUUID(),
  description: '',
  quantity: 1,
  unitPrice: 0,
  taxRate: 10,
});

const defaultInvoice = (): InvoiceData => ({
  fromName: '',
  fromAddress: '',
  fromPhone: '',
  fromEmail: '',
  fromBank: '',
  fromInvoiceNumber: '',
  toCompany: '',
  toContact: '',
  issueDate: new Date().toISOString().split('T')[0],
  dueDate: '',
  invoiceNo: `INV-${Date.now().toString().slice(-6)}`,
  items: [defaultItem()],
  notes: '',
});

const fmt = (n: number) =>
  n.toLocaleString('ja-JP', { style: 'currency', currency: 'JPY', maximumFractionDigits: 0 });

export default function InvoiceGenerator() {
  const [invoice, setInvoice] = useState<InvoiceData>(defaultInvoice);
  const [showPreview, setShowPreview] = useState(false);
  const [saveSender, setSaveSender] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  // ローカルストレージから請求元情報を読み込む
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        setInvoice(prev => ({ ...prev, ...data }));
        setSaveSender(true);
      }
    } catch {}
  }, []);

  const update = (field: keyof InvoiceData, value: InvoiceData[keyof InvoiceData]) => {
    setInvoice(prev => ({ ...prev, [field]: value }));
  };

  const updateItem = (id: string, field: keyof LineItem, value: string | number) => {
    setInvoice(prev => ({
      ...prev,
      items: prev.items.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  };

  const addItem = () => {
    setInvoice(prev => ({ ...prev, items: [...prev.items, defaultItem()] }));
  };

  const removeItem = (id: string) => {
    setInvoice(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id),
    }));
  };

  const handleSaveSender = (checked: boolean) => {
    setSaveSender(checked);
    if (checked) {
      const senderData = {
        fromName: invoice.fromName,
        fromAddress: invoice.fromAddress,
        fromPhone: invoice.fromPhone,
        fromEmail: invoice.fromEmail,
        fromBank: invoice.fromBank,
        fromInvoiceNumber: invoice.fromInvoiceNumber,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(senderData));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  // 合計計算
  const subtotal10 = invoice.items
    .filter(i => i.taxRate === 10)
    .reduce((sum, i) => sum + i.quantity * i.unitPrice, 0);
  const subtotal8 = invoice.items
    .filter(i => i.taxRate === 8)
    .reduce((sum, i) => sum + i.quantity * i.unitPrice, 0);
  const tax10 = Math.floor(subtotal10 * 0.1);
  const tax8 = Math.floor(subtotal8 * 0.08);
  const totalAmount = subtotal10 + subtotal8 + tax10 + tax8;

  const handlePrint = () => {
    setShowPreview(true);
    setTimeout(() => window.print(), 300);
  };

  return (
    <div className="space-y-6">
      {/* 請求元情報 */}
      <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="font-bold text-lg text-gray-900 mb-4">請求元（自分）の情報</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField label="名前・屋号 *" value={invoice.fromName} onChange={v => update('fromName', v)} placeholder="山田 太郎 / ○○デザイン" />
          <InputField label="住所" value={invoice.fromAddress} onChange={v => update('fromAddress', v)} placeholder="東京都渋谷区..." />
          <InputField label="電話番号" value={invoice.fromPhone} onChange={v => update('fromPhone', v)} placeholder="090-1234-5678" />
          <InputField label="メールアドレス" value={invoice.fromEmail} onChange={v => update('fromEmail', v)} placeholder="your@email.com" />
          <div className="sm:col-span-2">
            <InputField label="振込先（銀行名・支店・口座番号・名義）" value={invoice.fromBank} onChange={v => update('fromBank', v)} placeholder="○○銀行 △△支店 普通 1234567 ヤマダタロウ" />
          </div>
          <InputField label="インボイス登録番号（任意）" value={invoice.fromInvoiceNumber} onChange={v => update('fromInvoiceNumber', v)} placeholder="T1234567890123" />
        </div>
        <label className="flex items-center gap-2 mt-4 text-sm text-gray-600 cursor-pointer">
          <input
            type="checkbox"
            checked={saveSender}
            onChange={e => handleSaveSender(e.target.checked)}
            className="accent-indigo-600 w-4 h-4"
          />
          この情報をブラウザに保存する（次回から自動入力）
        </label>
      </section>

      {/* 請求先 */}
      <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="font-bold text-lg text-gray-900 mb-4">請求先の情報</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField label="会社名 *" value={invoice.toCompany} onChange={v => update('toCompany', v)} placeholder="株式会社○○" />
          <InputField label="担当者名（任意）" value={invoice.toContact} onChange={v => update('toContact', v)} placeholder="田中 様" />
        </div>
      </section>

      {/* 請求情報 */}
      <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="font-bold text-lg text-gray-900 mb-4">請求情報</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <InputField label="請求書番号" value={invoice.invoiceNo} onChange={v => update('invoiceNo', v)} />
          <InputField label="請求日 *" type="date" value={invoice.issueDate} onChange={v => update('issueDate', v)} />
          <InputField label="支払期限 *" type="date" value={invoice.dueDate} onChange={v => update('dueDate', v)} />
        </div>
      </section>

      {/* 明細 */}
      <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="font-bold text-lg text-gray-900 mb-4">請求明細</h2>
        <div className="space-y-3">
          <div className="hidden sm:grid grid-cols-12 gap-2 text-xs font-medium text-gray-500 px-1">
            <div className="col-span-5">品名・内容</div>
            <div className="col-span-2 text-right">数量</div>
            <div className="col-span-2 text-right">単価</div>
            <div className="col-span-2 text-center">消費税</div>
            <div className="col-span-1"></div>
          </div>
          {invoice.items.map(item => (
            <div key={item.id} className="grid grid-cols-12 gap-2 items-center">
              <div className="col-span-12 sm:col-span-5">
                <input
                  type="text"
                  placeholder="品名・業務内容"
                  value={item.description}
                  onChange={e => updateItem(item.id, 'description', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>
              <div className="col-span-4 sm:col-span-2">
                <input
                  type="number"
                  placeholder="数量"
                  value={item.quantity}
                  onChange={e => updateItem(item.id, 'quantity', Number(e.target.value))}
                  min={1}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 text-right"
                />
              </div>
              <div className="col-span-4 sm:col-span-2">
                <input
                  type="number"
                  placeholder="単価"
                  value={item.unitPrice}
                  onChange={e => updateItem(item.id, 'unitPrice', Number(e.target.value))}
                  min={0}
                  step={100}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 text-right"
                />
              </div>
              <div className="col-span-3 sm:col-span-2">
                <select
                  value={item.taxRate}
                  onChange={e => updateItem(item.id, 'taxRate', Number(e.target.value) as 10 | 8)}
                  className="w-full border border-gray-300 rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                >
                  <option value={10}>10%</option>
                  <option value={8}>8%（軽減）</option>
                </select>
              </div>
              <div className="col-span-1">
                {invoice.items.length > 1 && (
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                    aria-label="削除"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          ))}
          <button
            onClick={addItem}
            className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium mt-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            行を追加
          </button>
        </div>

        {/* 小計・合計 */}
        <div className="mt-6 border-t border-gray-200 pt-4 space-y-2">
          {subtotal10 > 0 && (
            <>
              <div className="flex justify-between text-sm text-gray-600">
                <span>小計（税率10%）</span><span>{fmt(subtotal10)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>消費税（10%）</span><span>{fmt(tax10)}</span>
              </div>
            </>
          )}
          {subtotal8 > 0 && (
            <>
              <div className="flex justify-between text-sm text-gray-600">
                <span>小計（税率8%）</span><span>{fmt(subtotal8)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>消費税（8%）</span><span>{fmt(tax8)}</span>
              </div>
            </>
          )}
          <div className="flex justify-between items-center font-bold text-lg border-t border-gray-300 pt-3 mt-3">
            <span>合計金額</span>
            <span className="text-indigo-600 text-2xl">{fmt(totalAmount)}</span>
          </div>
        </div>
      </section>

      {/* 備考 */}
      <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="font-bold text-lg text-gray-900 mb-4">備考（任意）</h2>
        <textarea
          value={invoice.notes}
          onChange={e => update('notes', e.target.value)}
          rows={3}
          placeholder="支払い条件、注意事項など"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
      </section>

      {/* アクション */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => setShowPreview(!showPreview)}
          className="flex-1 flex items-center justify-center gap-2 bg-white border border-indigo-300 text-indigo-600 font-semibold px-6 py-3 rounded-xl hover:bg-indigo-50 transition-colors"
        >
          {showPreview ? 'プレビューを閉じる' : '請求書をプレビュー'}
        </button>
        <button
          onClick={handlePrint}
          className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-indigo-700 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          PDFとして印刷・保存
        </button>
      </div>

      {/* プレビュー */}
      {showPreview && (
        <div ref={previewRef} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 print:shadow-none print:rounded-none" id="invoice-preview">
          <InvoicePreview invoice={invoice} subtotal10={subtotal10} subtotal8={subtotal8} tax10={tax10} tax8={tax8} totalAmount={totalAmount} />
        </div>
      )}

      <style>{`
        @media print {
          body * { visibility: hidden; }
          #invoice-preview, #invoice-preview * { visibility: visible; }
          #invoice-preview { position: absolute; top: 0; left: 0; width: 100%; padding: 40px; box-sizing: border-box; }
        }
      `}</style>
    </div>
  );
}

function InputField({
  label,
  value,
  onChange,
  placeholder = '',
  type = 'text',
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
      />
    </div>
  );
}

function InvoicePreview({
  invoice,
  subtotal10,
  subtotal8,
  tax10,
  tax8,
  totalAmount,
}: {
  invoice: InvoiceData;
  subtotal10: number;
  subtotal8: number;
  tax10: number;
  tax8: number;
  totalAmount: number;
}) {
  const fmt = (n: number) =>
    n.toLocaleString('ja-JP', { style: 'currency', currency: 'JPY', maximumFractionDigits: 0 });

  return (
    <div className="font-sans text-sm text-gray-900 max-w-2xl mx-auto">
      {/* ヘッダー */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">請求書</h1>
        {invoice.fromInvoiceNumber && (
          <p className="text-xs text-gray-500 mt-1">適格請求書</p>
        )}
      </div>

      <div className="flex justify-between mb-8">
        {/* 請求先 */}
        <div>
          <p className="font-bold text-lg">{invoice.toCompany || '（請求先）'} 御中</p>
          {invoice.toContact && <p className="text-gray-600">{invoice.toContact} 様</p>}
        </div>
        {/* 日付・番号 */}
        <div className="text-right text-sm">
          <p>請求書番号: {invoice.invoiceNo}</p>
          <p>請求日: {invoice.issueDate}</p>
          {invoice.dueDate && <p>支払期限: {invoice.dueDate}</p>}
        </div>
      </div>

      {/* 合計金額 */}
      <div className="border-2 border-gray-900 rounded-lg p-4 mb-8 text-center">
        <p className="text-sm text-gray-600 mb-1">ご請求金額</p>
        <p className="text-3xl font-bold">{fmt(totalAmount)}</p>
        <p className="text-xs text-gray-500 mt-1">（消費税込）</p>
      </div>

      {/* 明細 */}
      <table className="w-full mb-6 border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-3 py-2 text-left">品名・内容</th>
            <th className="border border-gray-300 px-3 py-2 text-right w-16">数量</th>
            <th className="border border-gray-300 px-3 py-2 text-right w-24">単価</th>
            <th className="border border-gray-300 px-3 py-2 text-right w-24">金額</th>
            <th className="border border-gray-300 px-3 py-2 text-center w-16">税率</th>
          </tr>
        </thead>
        <tbody>
          {invoice.items.map(item => (
            <tr key={item.id}>
              <td className="border border-gray-300 px-3 py-2">{item.description || '─'}</td>
              <td className="border border-gray-300 px-3 py-2 text-right">{item.quantity}</td>
              <td className="border border-gray-300 px-3 py-2 text-right">{fmt(item.unitPrice)}</td>
              <td className="border border-gray-300 px-3 py-2 text-right">{fmt(item.quantity * item.unitPrice)}</td>
              <td className="border border-gray-300 px-3 py-2 text-center">{item.taxRate}%{item.taxRate === 8 ? '※' : ''}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 税額内訳 */}
      <div className="flex justify-end mb-8">
        <div className="w-64">
          {subtotal10 > 0 && (
            <>
              <div className="flex justify-between py-1 text-sm"><span>10%対象</span><span>{fmt(subtotal10)}</span></div>
              <div className="flex justify-between py-1 text-sm"><span>消費税（10%）</span><span>{fmt(tax10)}</span></div>
            </>
          )}
          {subtotal8 > 0 && (
            <>
              <div className="flex justify-between py-1 text-sm"><span>8%対象（軽減）</span><span>{fmt(subtotal8)}</span></div>
              <div className="flex justify-between py-1 text-sm"><span>消費税（8%）</span><span>{fmt(tax8)}</span></div>
            </>
          )}
          <div className="flex justify-between py-2 border-t-2 border-gray-900 font-bold">
            <span>合計</span><span>{fmt(totalAmount)}</span>
          </div>
        </div>
      </div>

      {subtotal8 > 0 && <p className="text-xs text-gray-500 mb-6">※ 軽減税率対象</p>}

      {/* 請求元情報 */}
      <div className="border-t border-gray-300 pt-6">
        <div className="flex flex-col gap-1 text-sm">
          <p className="font-bold text-base">{invoice.fromName}</p>
          {invoice.fromAddress && <p>{invoice.fromAddress}</p>}
          {invoice.fromPhone && <p>TEL: {invoice.fromPhone}</p>}
          {invoice.fromEmail && <p>Email: {invoice.fromEmail}</p>}
          {invoice.fromInvoiceNumber && <p>登録番号: {invoice.fromInvoiceNumber}</p>}
          {invoice.fromBank && (
            <div className="mt-2">
              <p className="font-medium">振込先</p>
              <p>{invoice.fromBank}</p>
            </div>
          )}
        </div>
      </div>

      {invoice.notes && (
        <div className="mt-6 border-t border-gray-300 pt-4">
          <p className="font-medium mb-1">備考</p>
          <p className="text-sm whitespace-pre-wrap">{invoice.notes}</p>
        </div>
      )}
    </div>
  );
}
