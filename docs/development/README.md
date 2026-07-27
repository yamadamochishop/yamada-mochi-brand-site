# 開発ガイド（山田もち店ブランドサイト）

このドキュメントだけで、新しい開発者（またはAIエージェント）が環境構築からデプロイまで行えることを目標にしています。

## プロジェクト概要

- リポジトリ: `yamadamochishop/yamada-mochi-brand-site`
- 技術スタック: Next.js 15（App Router）/ React 19 / TypeScript / Tailwind CSS v3
- パッケージマネージャ: **pnpm**（npmやyarnは使わないこと）
- ホスティング: Vercel（`main`ブランチへのpushで自動ビルド・自動デプロイ）
- 本番URL: https://www.yamadamochi.com

## 開発開始手順

### 1. 必要なツール

| ツール  | バージョン目安       | 確認コマンド |
| ------- | -------------------- | ------------ |
| Node.js | 20系（`.nvmrc`参照） | `node -v`    |
| pnpm    | 最新                 | `pnpm -v`    |
| Git     | 最新                 | `git -v`     |

Node.js/pnpmが無い場合（macOS / Homebrew例）:

```bash
brew install node
npm install -g pnpm
```

### 2. セットアップ

```bash
git clone https://github.com/yamadamochishop/yamada-mochi-brand-site.git
cd yamada-mochi-brand-site
pnpm install
```

`pnpm install` 時に Husky の pre-commit フックが自動でセットアップされます（`package.json` の `prepare` スクリプト）。

### 3. ローカル起動

```bash
pnpm run dev
```

`http://localhost:3000` で確認できます。

## Build方法

```bash
pnpm run build   # 本番相当のビルド
pnpm run start   # ビルド済みアプリをローカルで起動して確認
```

`pnpm run build` は内部で ESLint と TypeScript の型チェックも実行します。以下のコマンドで個別にも確認できます。

```bash
pnpm run lint        # ESLint
pnpm run typecheck    # tsc --noEmit
pnpm run format:check # Prettierフォーマット確認
pnpm run check        # lint + typecheck + build をまとめて実行
```

## Deploy方法

このプロジェクトはVercelとGitHubが連携しており、**`main`ブランチへのpushで自動的に本番デプロイされます**。手動でのVercel CLI操作は基本的に不要です。

デプロイの流れ:

1. 作業ブランチで変更（または軽微な修正は`main`に直接、[GIT_WORKFLOW.md](./GIT_WORKFLOW.md)参照）
2. `pnpm run check`（lint + typecheck + build）が成功することを確認
3. コミット・push（PRが必要な変更はマージ）
4. Vercelダッシュボード（https://vercel.com）の「Deployments」で `Ready` になったことを確認
5. 本番URLで実際の表示を確認

## Claude Code利用方法

このプロジェクトでは、以下の役割分担で開発を進めます。

```
ChatGPT（要件定義・優先順位決定）
  ↓
Claude Code（作業管理・Build・Review・Git管理・Deploy）
  ↓
Codex（実装・テスト・修正）
  ↓
Claudeレビュー
  ↓
ChatGPT最終確認
```

詳細な役割分担・作業ルールは [AI_DEVELOPMENT_GUIDE.md](./AI_DEVELOPMENT_GUIDE.md) を参照してください。

Claude Codeへの依頼例:

- 「`/gift`ページの◯◯を修正して。修正後はbuild確認して、問題なければ本番デプロイして」
- 「このPRの差分をレビューして、副作用がないか確認して」

## Codex利用方法

Claude CodeはCodex CLI（`codex exec`）経由で実装作業を依頼します。Codexを直接使う場合の基本コマンド:

```bash
codex exec --sandbox workspace-write "依頼内容（対象ファイル・変更内容・完了条件を具体的に記載）"
```

運用ルール:

- **非対話実行の最大実行時間は10分**を目安とする。超過した場合はタスクを停止し、Claude Codeが引き継ぐ。
- Codexのサンドボックス（`workspace-write`）は**ネットワークアクセスがブロックされる**ため、`pnpm add`等の新規パッケージインストールはCodexの提案する変更をレビューした上でClaude Code側で実行する。
- 依頼プロンプトには「変更してよいファイル／変更してはいけないファイル」を明記する（UIやコンテンツに触れさせたくない場合は必ず明記）。

## トラブル時の対処

| 症状                                   | 対処                                                                                                                         |
| -------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `pnpm install` でエラー                | `pnpm-lock.yaml` と `package.json` の整合性を確認。`rm -rf node_modules && pnpm install`                                     |
| `pnpm run build` が失敗する            | エラーメッセージのファイル・行番号を確認し、`pnpm run typecheck` / `pnpm run lint` で個別に切り分け                          |
| コミットが `pre-commit` フックで止まる | `lint-staged` が対象ファイルのESLint/Prettierエラーを検出した状態。表示されたエラーを修正してから再コミット                  |
| Vercelのデプロイが `Error` になる      | Vercelダッシュボードの当該デプロイの `Build Logs` を確認。ローカルで `pnpm run build` が通ることを事前に確認してからpushする |
| 本番に反映されない                     | Vercelダッシュボードでデプロイが `Ready` かつ対象コミットが最新か確認。CDNキャッシュにより反映まで数分かかる場合がある       |
| Codexが応答しない・止まっている        | `codex exec` を10分程度で打ち切り、`git status` / `git diff` で変更有無を確認し、未完了ならClaude Codeが作業を引き継ぐ       |
