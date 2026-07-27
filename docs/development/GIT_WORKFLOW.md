# Git運用ルール（山田もち店ブランドサイト）

このドキュメントは、ChatGPT → Claude Code → Codex → Claudeレビュー → ChatGPT最終確認、という開発フローを安全に回すためのGit運用ルールをまとめたものです。

## リポジトリ概要

- GitHub: `yamadamochishop/yamada-mochi-brand-site`
- デプロイ: Vercel（GitHub連携、`main`ブランチへのpushで自動ビルド・自動デプロイ）
- パッケージマネージャ: **pnpm**（`vercel.json` の `installCommand` / `buildCommand` が pnpm 前提）

`main` にpushされた内容がそのまま本番 (`https://www.yamadamochi.com`) に反映されるため、`main` は常にビルドが通る状態を保つことを最優先とします。

## ブランチ運用ルール

- **`main`**: 本番相当ブランチ。常にデプロイ可能な状態を維持する。
- **作業ブランチ**: 複数ファイルにまたがる変更・新機能・構成変更を行う場合は、必ず作業ブランチを作成してから着手する。

  ```bash
  git checkout -b <type>/<短い説明>
  ```

  - `feat/xxx` … 新機能・新セクション追加
  - `fix/xxx` … 不具合修正
  - `docs/xxx` … ドキュメントのみの変更
  - `chore/xxx` … 開発基盤・設定・依存関係の変更（今回のPhase2はこの区分）
  - `content/xxx` … 商品情報・文章・SEO内容の変更

- **`main` 直push（例外運用）**: 影響範囲が1ファイル・軽微（表示崩れ・誤字・重複表示など）で、`build` / `lint` / `typecheck` を手元で確認できる場合に限り、ブランチを作らず `main` に直接コミットしてよい。ただし以下を必ず満たすこと。
  1. 変更前に `git status` / `git diff` で差分を確認
  2. `pnpm run build`（および `lint` / `typecheck`）が成功すること
  3. コミットメッセージに変更内容を明記
  4. push後、本番URLで反映を確認

  例: Phase1で行った `/gift` の賞味期限重複表示修正。

## Commit Messageルール

Conventional Commits形式を推奨します。

```
<type>: <変更内容（日本語可）>
```

- `feat`: 新機能
- `fix`: 不具合修正
- `docs`: ドキュメントのみ
- `style`: フォーマットのみ（Prettier適用など、動作に影響しない変更）
- `refactor`: 挙動を変えないコード整理
- `chore`: 開発基盤・依存関係・設定変更
- `content`: 商品情報・文章・SEO内容の変更

ルール:

- 1コミット1目的（複数の意図が混ざる変更はコミットを分ける）
- 本文（body）が必要な場合は空行を1行あけて記載
- 絵文字は使わない
- AIが作業した場合は `Co-Authored-By:` を付与する

## Pull Request運用方針

- 複数ファイルにまたがる変更・新機能・依存関係の追加・設定変更は、作業ブランチ→PR経由で `main` にマージする。
- PR本文には最低限以下を含める。
  - **Summary**: 何を・なぜ変更したか
  - **Test plan**: `pnpm run check`（lint + typecheck + build）の実行結果、ローカル動作確認内容
- レビューはClaude Codeが担当し、次を確認してからマージを承認する。
  - 差分が意図した範囲に収まっているか（UI・文章・SEO・商品情報に無関係な変更が混ざっていないか）
  - `pnpm run build` / `lint` / `typecheck` が成功するか
  - 副作用（他ページ・他コンポーネントへの影響）がないか
- マージ後、Vercelの自動デプロイ結果（Ready / Error）を確認してから完了とする。

## `.gitignore` 確認結果

現状の内容は妥当です（`.next` / `node_modules` / `out` / `dist` / `.env*` / `.vercel` / `*.log` / `.DS_Store` / `tsconfig.tsbuildinfo`）。

Phase2で以下を追記しました（開発基盤整備に伴う追加分）。

- ローカル作業用の一時ディレクトリ（下記「不要ファイル確認」参照）

## 不要ファイル確認

調査の結果、以下はいずれも **Gitには追跡されていない**（＝本番ビルドやデプロイには一切影響しない）ローカルの作業ファイルです。削除は行わず、`.gitignore` に追加して `git status` のノイズにならないようにしました。判断（削除してよいか）は運用側にお任せします。

| パス            | 内容                                               | サイズ |
| --------------- | -------------------------------------------------- | ------ |
| `tmp/`          | 画像検証・コンタクトシート生成用のスクリプト置き場 | 約12MB |
| `drive-latest/` | Google Driveから取り込んだ写真の一時置き場         | 約23MB |
| `README 2.md`   | `README.md` の古い重複ファイル（内容が一部古い）   | 8KB    |

`README 2.md` はGit管理下ではないため実害はありませんが、紛らわしいため削除を推奨します（本ドキュメントでは削除操作は行っていません）。
