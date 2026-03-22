# CLAUDE.md — フリーランスジム

## プロジェクト概要
フリーランスジム: フリーランスの案件獲得・単価・クライアントワーク・税務を
AIとツールで支援するメディアサイト。
URL: https://freelance.kolomua.com

## 技術スタック
- Astro（hybrid）+ React + Tailwind CSS
- AI: Claude Haiku 4.5（提案文生成のみ）
- ホスティング: Vercel（Serverless + Edge Middleware）
- レート制限: Upstash Redis
- PDF生成: jsPDF

## コマンド
- npm run dev — 開発サーバー
- npm run build — 本番ビルド

## ディレクトリ
- src/components/tools/ — React ツール（6種）
- src/pages/api/ — Serverless Functions
- src/content/blog/ — Markdown 記事
- src/data/ — 単価・経費・テンプレートJSON
- src/lib/ — APIクライアント・バリデーション

## ツール一覧
### カテゴリA: 案件獲得・クライアントワーク
- A1: ProposalWriter.tsx — 提案文AI（Claude Haiku 4.5使用）
- A2: RateChecker.tsx — 単価診断（フロントエンド完結）
- A3: ClientTemplates.tsx — テンプレート集（フロントエンド完結）

### カテゴリB: 税務・事務
- B1: InvoiceGenerator.tsx — 請求書ジェネレーター
- B2: TaxSimulator.tsx — 手取り・税金シミュレーター
- B3: ExpenseChecker.tsx — 経費判定チェックリスト

## ルール
- A1（提案文AI）のみ Claude API 使用。他5ツールはフロントエンド完結。
- APIキーはサーバーサイドのみ。クライアントコードに含めない。
- 日本語で記事を書く。Tailwind CSS でスタイリング。
- コミットメッセージは日本語。
- staticページには `export const prerender = true` を付ける。
