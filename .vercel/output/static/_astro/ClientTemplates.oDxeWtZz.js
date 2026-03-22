import{j as e}from"./jsx-runtime.u17CrQMm.js";import{r as u}from"./index.COcQYvav.js";const S=[{id:"requirements",title:"要件確認シート",emoji:"📋",description:"スコープクリープを防ぐ。受注前に必ず確認すべき項目を網羅。",fields:[{id:"projectName",label:"プロジェクト名・案件名",type:"text",placeholder:"○○サイトリニューアル"},{id:"client",label:"クライアント名",type:"text",placeholder:"株式会社○○"},{id:"deliverables",label:"成果物（具体的に）",type:"textarea",placeholder:`・TOPページデザイン（PC/SP）
・下層ページ5本のデザイン
・コーディング（HTML/CSS/JS）`},{id:"outOfScope",label:"対象外（スコープ外）",type:"textarea",placeholder:`・サーバー設定
・CMS導入
・修正は3回まで`},{id:"deadline",label:"納期",type:"text",placeholder:"2026年4月30日"},{id:"budget",label:"予算・報酬",type:"text",placeholder:"30万円（税込）"},{id:"paymentTerms",label:"支払い条件",type:"text",placeholder:"納品後30日以内・銀行振込"},{id:"revisions",label:"修正回数",type:"text",placeholder:"デザイン：2回まで、コーディング：軽微な修正のみ"},{id:"communication",label:"連絡手段・頻度",type:"text",placeholder:"Slack / 週1回の進捗報告"},{id:"materials",label:"クライアントが用意するもの",type:"textarea",placeholder:`・テキスト原稿
・ロゴデータ
・素材画像`},{id:"notes",label:"その他・特記事項",type:"textarea",placeholder:""}],outputTemplate:`# 要件確認シート

**プロジェクト**: {{projectName}}
**クライアント**: {{client}}
**作成日**: {{date}}

## 成果物
{{deliverables}}

## スコープ外
{{outOfScope}}

## 納期
{{deadline}}

## 報酬・支払い
- 報酬: {{budget}}
- 支払い条件: {{paymentTerms}}

## 修正対応
{{revisions}}

## コミュニケーション
{{communication}}

## クライアント提供物
{{materials}}

## 特記事項
{{notes}}

---
上記内容でご認識に相違ないかご確認ください。`},{id:"estimate",title:"見積書",emoji:"💴",description:"作業項目・単価から見積書をPDF出力。",fields:[{id:"fromName",label:"提出者（自分）",type:"text",placeholder:"山田 太郎"},{id:"toName",label:"提出先（クライアント）",type:"text",placeholder:"株式会社○○ 田中様"},{id:"projectName",label:"件名",type:"text",placeholder:"Webサイト制作の件"},{id:"validUntil",label:"見積有効期限",type:"text",placeholder:"2026年4月30日"},{id:"notes",label:"備考",type:"textarea",placeholder:`・別途、サーバー代・ドメイン代は実費精算
・修正はデザイン2回まで含む`}],outputTemplate:""},{id:"contract-check",title:"契約前チェックリスト",emoji:"✅",description:"受注判断のための10項目チェック。断るべき案件を見極める。",fields:[],outputTemplate:""},{id:"delivery-email",title:"納品メール",emoji:"📨",description:"成果物リスト付きの確認依頼メール文。",fields:[{id:"clientName",label:"クライアント名",type:"text",placeholder:"田中"},{id:"projectName",label:"案件名",type:"text",placeholder:"○○サイト制作"},{id:"deliverables",label:"納品物リスト",type:"textarea",placeholder:`・デザインデータ（Figma URL）
・コーディング済みHTML/CSS
・使い方マニュアル（PDF）`},{id:"confirmationDeadline",label:"確認期限",type:"text",placeholder:"2026年4月30日"},{id:"yourName",label:"自分の名前",type:"text",placeholder:"山田 太郎"}],outputTemplate:`{{clientName}}様

お世話になっております、{{yourName}}です。

「{{projectName}}」の納品をお知らせいたします。

下記の成果物をご確認いただけますでしょうか。

【納品物】
{{deliverables}}

ご不明点や修正のご要望がございましたら、{{confirmationDeadline}}までにご連絡いただけますと幸いです。

よろしくお願いいたします。
{{yourName}}`},{id:"scope-creep-email",title:"追加作業の断り/交渉メール",emoji:"🛡️",description:"「それも対応して」に角の立たない断り方・追加費用の伝え方。",fields:[{id:"clientName",label:"クライアント名",type:"text",placeholder:"田中"},{id:"addedRequest",label:"追加依頼の内容",type:"textarea",placeholder:"スマホ対応のコーディングも追加してほしい"},{id:"additionalFee",label:"追加費用",type:"text",placeholder:"30,000円（税込）"},{id:"additionalTime",label:"追加納期",type:"text",placeholder:"3営業日"},{id:"yourName",label:"自分の名前",type:"text",placeholder:"山田 太郎"}],outputTemplate:`{{clientName}}様

お世話になっております、{{yourName}}です。

ご要望いただいた「{{addedRequest}}」についてご連絡いたします。

当初のお見積もり・契約範囲には含まれておりませんでしたが、追加作業として対応は可能です。

【追加作業の概要】
・内容: {{addedRequest}}
・追加費用: {{additionalFee}}
・追加納期: 現在の納期より{{additionalTime}}延長

ご検討いただき、進めるかどうかをご連絡いただけますでしょうか。

よろしくお願いいたします。
{{yourName}}`}],j=S,f=[{id:1,text:"契約書・発注書が書面（メール可）で存在する",critical:!0},{id:2,text:"報酬額が明記されている",critical:!0},{id:3,text:"支払い期日が明記されている",critical:!0},{id:4,text:"納品物・成果物の定義が明確",critical:!0},{id:5,text:"修正対応の範囲・回数が定まっている",critical:!0},{id:6,text:"著作権・知的財産権の帰属が明確",critical:!1},{id:7,text:"秘密保持（NDA）の要件を把握している",critical:!1},{id:8,text:"キャンセル時の報酬・違約金ルールがある",critical:!1},{id:9,text:"クライアントの評判・支払い実績を確認した",critical:!1},{id:10,text:"自分のスケジュールに無理がない",critical:!1}];function v(o,r){let l=o.replace("{{date}}",new Date().toLocaleDateString("ja-JP"));for(const[c,n]of Object.entries(r))l=l.replaceAll(`{{${c}}}`,n||`（${c}未入力）`);return l}const g=o=>`¥${o.toLocaleString("ja-JP")}`;function k({template:o}){const[r,l]=u.useState({}),[c,n]=u.useState([{id:"1",description:"",quantity:1,unitPrice:0}]),[m,p]=u.useState(!1),i=()=>n(a=>[...a,{id:Date.now().toString(),description:"",quantity:1,unitPrice:0}]),h=a=>n(s=>s.filter(b=>b.id!==a)),t=(a,s,b)=>n(T=>T.map(y=>y.id===a?{...y,[s]:b}:y)),d=c.reduce((a,s)=>a+s.quantity*s.unitPrice,0),x=Math.floor(d*.1),N=d+x,w=()=>{const a=c.map(s=>`- ${s.description||"（未入力）"}: ${s.quantity}個 × ${g(s.unitPrice)} = ${g(s.quantity*s.unitPrice)}`).join(`
`);return`【見積書】
件名: ${r.projectName||""}
提出者: ${r.fromName||""}
提出先: ${r.toName||""}
有効期限: ${r.validUntil||""}

【内訳】
${a}

小計: ${g(d)}
消費税（10%）: ${g(x)}
合計: ${g(N)}

【備考】
${r.notes||""}`},C=async()=>{await navigator.clipboard.writeText(w()),p(!0),setTimeout(()=>p(!1),2e3)};return e.jsxs("div",{className:"space-y-5",children:[o.fields.map(a=>e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-1",children:a.label}),a.type==="textarea"?e.jsx("textarea",{rows:2,value:r[a.id]??"",onChange:s=>l(b=>({...b,[a.id]:s.target.value})),placeholder:a.placeholder,className:"w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"}):e.jsx("input",{type:"text",value:r[a.id]??"",onChange:s=>l(b=>({...b,[a.id]:s.target.value})),placeholder:a.placeholder,className:"w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"})]},a.id)),e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"作業項目"}),e.jsx("div",{className:"space-y-2",children:c.map(a=>e.jsxs("div",{className:"grid grid-cols-12 gap-2 items-center",children:[e.jsx("div",{className:"col-span-6",children:e.jsx("input",{type:"text",placeholder:"作業内容",value:a.description,onChange:s=>t(a.id,"description",s.target.value),className:"w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"})}),e.jsx("div",{className:"col-span-2",children:e.jsx("input",{type:"number",placeholder:"数量",value:a.quantity,onChange:s=>t(a.id,"quantity",Number(s.target.value)),min:1,className:"w-full border border-gray-300 rounded-lg px-2 py-2 text-sm text-right focus:outline-none focus:ring-2 focus:ring-indigo-400"})}),e.jsx("div",{className:"col-span-3",children:e.jsx("input",{type:"number",placeholder:"単価",value:a.unitPrice,onChange:s=>t(a.id,"unitPrice",Number(s.target.value)),step:1e3,className:"w-full border border-gray-300 rounded-lg px-2 py-2 text-sm text-right focus:outline-none focus:ring-2 focus:ring-indigo-400"})}),e.jsx("div",{className:"col-span-1 text-center",children:c.length>1&&e.jsx("button",{onClick:()=>h(a.id),className:"text-gray-400 hover:text-red-500",children:"×"})})]},a.id))}),e.jsx("button",{onClick:i,className:"mt-2 text-sm text-indigo-600 hover:underline",children:"+ 行を追加"}),e.jsxs("div",{className:"mt-3 text-right text-sm space-y-1",children:[e.jsxs("p",{className:"text-gray-500",children:["小計: ",g(d)]}),e.jsxs("p",{className:"text-gray-500",children:["消費税（10%）: ",g(x)]}),e.jsxs("p",{className:"font-bold text-gray-900 text-lg",children:["合計: ",g(N)]})]})]}),e.jsx("button",{onClick:C,className:"w-full flex items-center justify-center gap-2 bg-indigo-600 text-white font-semibold px-5 py-3 rounded-xl hover:bg-indigo-700 transition-colors",children:m?"✓ コピーしました":"📋 テキストをコピー"})]})}function $(){const[o,r]=u.useState(new Set),l=i=>{r(h=>{const t=new Set(h);return t.has(i)?t.delete(i):t.add(i),t})},n=f.filter(i=>i.critical).every(i=>o.has(i.id)),m=o.size,p=f.length;return e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:`rounded-xl p-4 text-center ${n?"bg-green-50 border border-green-200":"bg-amber-50 border border-amber-200"}`,children:[e.jsxs("p",{className:`font-bold text-lg ${n?"text-green-700":"text-amber-700"}`,children:[m,"/",p," 項目確認済み"]}),!n&&e.jsx("p",{className:"text-amber-600 text-sm mt-1",children:"⚠️ 必須項目（赤ラベル）を必ず確認してください"}),n&&m===p&&e.jsx("p",{className:"text-green-600 text-sm mt-1",children:"✅ 全項目OK！安心して受注できます"})]}),e.jsx("div",{className:"space-y-2",children:f.map(i=>e.jsxs("label",{className:"flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 cursor-pointer",children:[e.jsx("input",{type:"checkbox",checked:o.has(i.id),onChange:()=>l(i.id),className:"accent-indigo-600 w-5 h-5 mt-0.5 flex-shrink-0"}),e.jsxs("div",{className:"flex-1",children:[e.jsx("span",{className:"text-sm text-gray-800",children:i.text}),i.critical&&e.jsx("span",{className:"ml-2 text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full",children:"必須"})]})]},i.id))})]})}function P({template:o}){const[r,l]=u.useState({}),[c,n]=u.useState(""),[m,p]=u.useState(!1),i=()=>{n(v(o.outputTemplate,r))},h=async()=>{await navigator.clipboard.writeText(c),p(!0),setTimeout(()=>p(!1),2e3)};return e.jsxs("div",{className:"space-y-4",children:[o.fields.map(t=>e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-1",children:t.label}),t.type==="textarea"?e.jsx("textarea",{rows:3,value:r[t.id]??"",onChange:d=>l(x=>({...x,[t.id]:d.target.value})),placeholder:t.placeholder,className:"w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"}):e.jsx("input",{type:"text",value:r[t.id]??"",onChange:d=>l(x=>({...x,[t.id]:d.target.value})),placeholder:t.placeholder,className:"w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"})]},t.id)),e.jsx("button",{onClick:i,className:"w-full bg-indigo-600 text-white font-semibold px-5 py-3 rounded-xl hover:bg-indigo-700 transition-colors",children:"テンプレートを生成"}),c&&e.jsxs("div",{className:"bg-gray-50 rounded-xl p-4",children:[e.jsx("pre",{className:"text-sm text-gray-800 whitespace-pre-wrap font-sans leading-relaxed",children:c}),e.jsx("button",{onClick:h,className:"mt-3 flex items-center gap-1.5 text-sm bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors",children:m?"✓ コピーしました":"📋 コピー"})]})]})}function q({template:o}){const[r,l]=u.useState({}),[c,n]=u.useState(""),[m,p]=u.useState(!1),i=()=>n(v(o.outputTemplate,r)),h=async()=>{await navigator.clipboard.writeText(c),p(!0),setTimeout(()=>p(!1),2e3)};return e.jsxs("div",{className:"space-y-4",children:[o.fields.map(t=>e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-1",children:t.label}),t.type==="textarea"?e.jsx("textarea",{rows:3,value:r[t.id]??"",onChange:d=>l(x=>({...x,[t.id]:d.target.value})),placeholder:t.placeholder,className:"w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"}):e.jsx("input",{type:"text",value:r[t.id]??"",onChange:d=>l(x=>({...x,[t.id]:d.target.value})),placeholder:t.placeholder,className:"w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"})]},t.id)),e.jsx("button",{onClick:i,className:"w-full bg-indigo-600 text-white font-semibold px-5 py-3 rounded-xl hover:bg-indigo-700 transition-colors",children:"確認シートを生成"}),c&&e.jsxs("div",{className:"bg-gray-50 rounded-xl p-4",children:[e.jsx("pre",{className:"text-sm text-gray-800 whitespace-pre-wrap font-sans leading-relaxed",children:c}),e.jsx("button",{onClick:h,className:"mt-3 flex items-center gap-1.5 text-sm bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors",children:m?"✓ コピーしました":"📋 コピー"})]})]})}function I(){const[o,r]=u.useState(j[0].id),l=j.find(n=>n.id===o),c=()=>l.id==="requirements"?e.jsx(q,{template:l}):l.id==="estimate"?e.jsx(k,{template:l}):l.id==="contract-check"?e.jsx($,{}):e.jsx(P,{template:l});return e.jsxs("div",{className:"space-y-6",children:[e.jsx("div",{className:"bg-white rounded-2xl shadow-sm border border-gray-100 p-4",children:e.jsx("div",{className:"flex flex-col sm:flex-row gap-2",children:j.map(n=>e.jsxs("button",{onClick:()=>r(n.id),className:`flex-1 flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${o===n.id?"bg-indigo-600 text-white":"bg-gray-100 text-gray-600 hover:bg-gray-200"}`,children:[e.jsx("span",{children:n.emoji}),e.jsx("span",{children:n.title})]},n.id))})}),e.jsx("div",{className:"bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-3",children:e.jsxs("p",{className:"text-sm text-indigo-700",children:[e.jsxs("span",{className:"font-bold",children:[l.emoji," ",l.title]}),e.jsx("span",{className:"ml-2 text-indigo-600",children:l.description})]})}),e.jsx("div",{className:"bg-white rounded-2xl shadow-sm border border-gray-100 p-6",children:c()})]})}export{I as default};
