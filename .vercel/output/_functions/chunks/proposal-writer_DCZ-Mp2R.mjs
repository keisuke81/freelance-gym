import { c as createComponent } from './astro-component_BAZECEw4.mjs';
import 'piccolore';
import { l as createRenderInstruction, m as maybeRenderHead, h as addAttribute, r as renderTemplate, n as renderHead, o as renderComponent, p as renderSlot, u as unescapeHTML } from './entrypoint_CljESoIv.mjs';
import 'clsx';
import { jsxs, jsx, Fragment } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';

async function renderScript(result, id) {
  const inlined = result.inlinedScripts.get(id);
  let content = "";
  if (inlined != null) {
    if (inlined) {
      content = `<script type="module">${inlined}</script>`;
    }
  } else {
    const resolved = await result.resolve(id);
    content = `<script type="module" src="${result.userAssetsBase ? (result.base === "/" ? "" : result.base) + result.userAssetsBase : ""}${resolved}"></script>`;
  }
  return createRenderInstruction({ type: "script", id, content });
}

const $$Header = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Header;
  const navLinks = [
    { href: "/tools/", label: "ツール" },
    { href: "/blog/", label: "ブログ" },
    { href: "/about/", label: "About" }
  ];
  const currentPath = Astro2.url.pathname;
  return renderTemplate`${maybeRenderHead()}<header class="bg-white border-b border-gray-200 sticky top-0 z-50"> <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"> <div class="flex items-center justify-between h-16"> <a href="/" class="flex items-center gap-2 font-bold text-xl text-indigo-600 hover:text-indigo-700 transition-colors"> <span class="text-2xl">💪</span> <span>フリーランスジム</span> </a> <nav class="hidden md:flex items-center gap-6"> ${navLinks.map((link) => renderTemplate`<a${addAttribute(link.href, "href")}${addAttribute(`text-sm font-medium transition-colors hover:text-indigo-600 ${currentPath.startsWith(link.href) ? "text-indigo-600" : "text-gray-600"}`, "class")}> ${link.label} </a>`)} </nav> <button class="md:hidden text-gray-600" id="mobile-menu-btn" aria-label="メニュー"> <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path> </svg> </button> </div> <div class="md:hidden hidden pb-4" id="mobile-menu"> ${navLinks.map((link) => renderTemplate`<a${addAttribute(link.href, "href")}${addAttribute(`block py-2 text-sm font-medium transition-colors hover:text-indigo-600 ${currentPath.startsWith(link.href) ? "text-indigo-600" : "text-gray-600"}`, "class")}> ${link.label} </a>`)} </div> </div> </header> ${renderScript($$result, "/Users/keisuke/Desktop/freelance-gym/src/components/layout/Header.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/keisuke/Desktop/freelance-gym/src/components/layout/Header.astro", void 0);

const $$Footer = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<footer class="bg-gray-900 text-gray-400 mt-20"> <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12"> <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8"> <div> <div class="flex items-center gap-2 font-bold text-xl text-white mb-3"> <span class="text-2xl">💪</span> <span>フリーランスジム</span> </div> <p class="text-sm leading-relaxed">
フリーランスの「困った」を、秒で解決。<br>
請求書・税金・経費、すべて無料ツールでサクッと片付けよう。
</p> </div> <div> <h3 class="text-white font-semibold mb-3">ツール</h3> <ul class="space-y-2 text-sm"> <li><a href="/tools/invoice/" class="hover:text-white transition-colors">請求書ジェネレーター</a></li> <li><a href="/tools/tax-simulator/" class="hover:text-white transition-colors">手取り・税金シミュレーター</a></li> <li><a href="/tools/expense-checker/" class="hover:text-white transition-colors">経費判定チェックリスト</a></li> </ul> </div> <div> <h3 class="text-white font-semibold mb-3">サイト情報</h3> <ul class="space-y-2 text-sm"> <li><a href="/blog/" class="hover:text-white transition-colors">ブログ</a></li> <li><a href="/about/" class="hover:text-white transition-colors">About</a></li> <li><a href="/privacy/" class="hover:text-white transition-colors">プライバシーポリシー</a></li> </ul> </div> </div> <div class="border-t border-gray-800 pt-6 text-center text-xs"> <p>&copy; ${(/* @__PURE__ */ new Date()).getFullYear()} フリーランスジム. All rights reserved.</p> <p class="mt-1">本ツールの計算結果は概算です。詳細は税理士等の専門家にご相談ください。</p> </div> </div> </footer>`;
}, "/Users/keisuke/Desktop/freelance-gym/src/components/layout/Footer.astro", void 0);

const $$BaseLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$BaseLayout;
  const {
    title,
    description = "フリーランスの「困った」を、秒で解決。請求書・税金・経費、すべて無料ツールでサクッと片付けよう。",
    ogImage = "/ogp.png"
  } = Astro2.props;
  const canonicalURL = new URL(Astro2.url.pathname, Astro2.site);
  return renderTemplate`<html lang="ja"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${title}</title><meta name="description"${addAttribute(description, "content")}><link rel="canonical"${addAttribute(canonicalURL, "href")}><!-- OGP --><meta property="og:type" content="website"><meta property="og:title"${addAttribute(title, "content")}><meta property="og:description"${addAttribute(description, "content")}><meta property="og:image"${addAttribute(new URL(ogImage, Astro2.site), "content")}><meta property="og:url"${addAttribute(canonicalURL, "content")}><meta property="og:site_name" content="フリーランスジム"><meta name="twitter:card" content="summary_large_image"><!-- Favicon --><link rel="icon" type="image/svg+xml" href="/favicon.svg"><!-- Google Fonts --><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&display=swap" rel="stylesheet">${renderHead()}</head> <body class="bg-gray-50 text-gray-900 min-h-screen flex flex-col"> ${renderComponent($$result, "Header", $$Header, {})} <main class="flex-1"> ${renderSlot($$result, $$slots["default"])} </main> ${renderComponent($$result, "Footer", $$Footer, {})} </body></html>`;
}, "/Users/keisuke/Desktop/freelance-gym/src/components/layout/BaseLayout.astro", void 0);

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$JsonLd = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$JsonLd;
  const { type, data } = Astro2.props;
  const schema = {
    "@context": "https://schema.org",
    "@type": type,
    ...data
  };
  return renderTemplate(_a || (_a = __template(['<script type="application/ld+json">', "<\/script>"])), unescapeHTML(JSON.stringify(schema)));
}, "/Users/keisuke/Desktop/freelance-gym/src/components/seo/JsonLd.astro", void 0);

const $$ToolLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$ToolLayout;
  const { title, description, toolName, relatedArticles = [] } = Astro2.props;
  const pageTitle = `${toolName}｜フリーランスジム`;
  const pageDescription = `${description}。会員登録不要・完全無料で今すぐ使えます。`;
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": pageTitle, "description": pageDescription }, { "default": ($$result2) => renderTemplate`  ${maybeRenderHead()}<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10"> <div class="mb-8"> <a href="/tools/" class="text-sm text-indigo-600 hover:underline">← ツール一覧</a> <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 mt-2">${toolName}</h1> <p class="text-gray-500 mt-1">${description}</p> </div> ${renderSlot($$result2, $$slots["default"])} ${relatedArticles.length > 0 && renderTemplate`<div class="mt-12 border-t border-gray-200 pt-8"> <h2 class="text-lg font-bold text-gray-900 mb-4">関連記事</h2> <ul class="space-y-2"> ${relatedArticles.map((article) => renderTemplate`<li> <a${addAttribute(article.href, "href")} class="text-indigo-600 hover:underline text-sm">
→ ${article.title} </a> </li>`)} </ul> </div>`} </div> `, "head": ($$result2) => renderTemplate`${renderComponent($$result2, "JsonLd", $$JsonLd, { "type": "SoftwareApplication", "data": {
    name: toolName,
    description: pageDescription,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "JPY" }
  }, "slot": "head" })}` })}`;
}, "/Users/keisuke/Desktop/freelance-gym/src/layouts/ToolLayout.astro", void 0);

function RateLimitNotice({ message }) {
  return /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4", children: [
    /* @__PURE__ */ jsx("span", { className: "text-xl flex-shrink-0", children: "⚠️" }),
    /* @__PURE__ */ jsx("p", { className: "text-sm text-amber-800", children: message })
  ] });
}

const STORAGE_KEY = "freelance-gym-proposal-profile";
const defaultProfile = {
  jobType: "Webエンジニア",
  years: 3,
  skills: "",
  achievements: ""
};
const TONES = [
  { value: "polite", label: "丁寧", desc: "誠実・信頼感重視" },
  { value: "casual", label: "カジュアル", desc: "親しみやすい" },
  { value: "passionate", label: "熱意重視", desc: "情熱・やる気重視" }
];
function ProposalWriter() {
  const [profile, setProfile] = useState(defaultProfile);
  const [jobDescription, setJobDescription] = useState("");
  const [tone, setTone] = useState("polite");
  const [proposal, setProposal] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
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
    } catch {
    }
  }, []);
  const saveProfile = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    setProfileSaved(true);
    setShowProfile(false);
  };
  const generate = async () => {
    if (!jobDescription.trim()) {
      setError("案件情報を入力してください");
      return;
    }
    setError("");
    setLoading(true);
    setProposal("");
    try {
      const res = await fetch("/api/generate-proposal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobDescription, profile, tone })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "生成に失敗しました");
        return;
      }
      setProposal(data.proposal);
    } catch {
      setError("通信エラーが発生しました。再度お試しください。");
    } finally {
      setLoading(false);
    }
  };
  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(proposal);
    setCopied(true);
    setTimeout(() => setCopied(false), 2e3);
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-sm border border-gray-100 p-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
        /* @__PURE__ */ jsxs("h2", { className: "font-bold text-lg text-gray-900", children: [
          "あなたのプロフィール",
          profileSaved && /* @__PURE__ */ jsx("span", { className: "ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full", children: "保存済み" })
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setShowProfile(!showProfile),
            className: "text-sm text-indigo-600 hover:underline",
            children: showProfile ? "折りたたむ" : "編集する"
          }
        )
      ] }),
      showProfile && /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "職種" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: profile.jobType,
                onChange: (e) => setProfile((p) => ({ ...p, jobType: e.target.value })),
                placeholder: "例: Webエンジニア、UIデザイナー",
                className: "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: [
              "経験年数: ",
              /* @__PURE__ */ jsxs("span", { className: "text-indigo-600 font-bold", children: [
                profile.years,
                "年"
              ] })
            ] }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "range",
                value: profile.years,
                onChange: (e) => setProfile((p) => ({ ...p, years: Number(e.target.value) })),
                min: 0,
                max: 30,
                className: "w-full accent-indigo-600"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: [
            "得意分野・スキル ",
            /* @__PURE__ */ jsx("span", { className: "text-gray-400 text-xs", children: "（200文字以内）" })
          ] }),
          /* @__PURE__ */ jsx(
            "textarea",
            {
              value: profile.skills,
              onChange: (e) => setProfile((p) => ({ ...p, skills: e.target.value.slice(0, 200) })),
              rows: 2,
              placeholder: "React/TypeScript歴4年。ECサイト・SaaSのフロント開発が得意。",
              className: "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            }
          ),
          /* @__PURE__ */ jsxs("p", { className: "text-right text-xs text-gray-400 mt-1", children: [
            profile.skills.length,
            "/200"
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: [
            "主な実績 ",
            /* @__PURE__ */ jsx("span", { className: "text-gray-400 text-xs", children: "（箇条書きで3〜5個）" })
          ] }),
          /* @__PURE__ */ jsx(
            "textarea",
            {
              value: profile.achievements,
              onChange: (e) => setProfile((p) => ({ ...p, achievements: e.target.value.slice(0, 500) })),
              rows: 3,
              placeholder: "・月間100万PVのメディアサイトのリファクタリング\n・スタートアップの0→1フロント開発（チームリード）\n・某ECサイトの表示速度を50%改善",
              className: "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            }
          )
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: saveProfile,
            className: "bg-indigo-600 text-white font-semibold px-5 py-2 rounded-lg text-sm hover:bg-indigo-700 transition-colors",
            children: "プロフィールを保存する"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-sm border border-gray-100 p-6", children: [
      /* @__PURE__ */ jsx("h2", { className: "font-bold text-lg text-gray-900 mb-4", children: "案件情報を貼り付け" }),
      /* @__PURE__ */ jsx(
        "textarea",
        {
          value: jobDescription,
          onChange: (e) => setJobDescription(e.target.value.slice(0, 2e3)),
          rows: 6,
          placeholder: "クラウドソーシングの案件ページや求人票の内容をそのまま貼り付けてください。\n\n例:\n「Reactを使ったWebアプリの開発をお願いしたいです。ECサイトのフロントエンド部分で、TypeScriptが使える方を探しています。予算は月30万円程度を想定...」",
          className: "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        }
      ),
      /* @__PURE__ */ jsxs("p", { className: "text-right text-xs text-gray-400 mt-1", children: [
        jobDescription.length,
        "/2000"
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-sm border border-gray-100 p-6", children: [
      /* @__PURE__ */ jsx("h2", { className: "font-bold text-lg text-gray-900 mb-4", children: "提案文のトーン" }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-3 gap-3", children: TONES.map((t) => /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => setTone(t.value),
          className: `p-3 rounded-xl border-2 text-center transition-colors ${tone === t.value ? "border-indigo-500 bg-indigo-50" : "border-gray-200 hover:border-indigo-300"}`,
          children: [
            /* @__PURE__ */ jsx("p", { className: `font-semibold text-sm ${tone === t.value ? "text-indigo-700" : "text-gray-700"}`, children: t.label }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-400 mt-0.5", children: t.desc })
          ]
        },
        t.value
      )) })
    ] }),
    error && /* @__PURE__ */ jsx(RateLimitNotice, { message: error }),
    /* @__PURE__ */ jsx(
      "button",
      {
        onClick: generate,
        disabled: loading,
        className: "w-full flex items-center justify-center gap-2 bg-indigo-600 text-white font-bold px-6 py-4 rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed text-lg",
        children: loading ? /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsxs("svg", { className: "animate-spin h-5 w-5", xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", children: [
            /* @__PURE__ */ jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }),
            /* @__PURE__ */ jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" })
          ] }),
          "AI生成中..."
        ] }) : /* @__PURE__ */ jsx(Fragment, { children: "⚡ 提案文を生成する" })
      }
    ),
    proposal && /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-sm border border-indigo-100 p-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
        /* @__PURE__ */ jsx("h2", { className: "font-bold text-lg text-gray-900", children: "生成された提案文" }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: copyToClipboard,
              className: "flex items-center gap-1.5 text-sm bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors",
              children: copied ? "✓ コピーしました" : "📋 コピー"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: generate,
              className: "text-sm border border-gray-300 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors",
              children: "🔄 再生成"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "bg-gray-50 rounded-xl p-4", children: /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-800 whitespace-pre-wrap leading-relaxed", children: proposal }) }),
      /* @__PURE__ */ jsxs("p", { className: "text-xs text-gray-400 mt-3 text-right", children: [
        proposal.length,
        "文字"
      ] })
    ] }),
    /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-400 text-center", children: "AIが生成した文章はそのまま使用せず、必ず内容を確認・加筆してから使用してください。 1日30回まで無料でご利用いただけます。" })
  ] });
}

const prerender = false;
const $$ProposalWriter = createComponent(($$result, $$props, $$slots) => {
  const relatedArticles = [
    { title: "クラウドソーシングで採用される提案文の書き方", href: "/blog/invoice-guide/" }
  ];
  return renderTemplate`${renderComponent($$result, "ToolLayout", $$ToolLayout, { "title": "提案文AIジェネレーター", "description": "案件情報を貼るだけでAIが提案文を自動生成。クラウドソーシングや直営業で使えます", "toolName": "提案文AIジェネレーター", "relatedArticles": relatedArticles }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "ProposalWriter", ProposalWriter, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/Users/keisuke/Desktop/freelance-gym/src/components/tools/ProposalWriter", "client:component-export": "default" })} ` })}`;
}, "/Users/keisuke/Desktop/freelance-gym/src/pages/tools/proposal-writer.astro", void 0);

const $$file = "/Users/keisuke/Desktop/freelance-gym/src/pages/tools/proposal-writer.astro";
const $$url = "/tools/proposal-writer";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$ProposalWriter,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
