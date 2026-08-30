# AGENTS.md — 山田もち店ブランドサイト

このリポジトリで作業するすべてのAIエージェント（Claude Code、Codex、その他）が最初に読む規則です。

## 正本

- コードとコンテンツの正本は GitHub `yamadamochishop/yamada-mochi-brand-site` の `origin/main` です。
- `main` への push は Vercel により本番サイトへ自動デプロイされます。`main` に入る変更はすべて本番影響のある変更として扱います。
- 商品名・価格・内容量・送料・販売状態（販売中／終了／予定）の正本は `data/` と BASE です。ドキュメントの記述をそのまま事実として扱いません。
- ローカルの作業コピー、他のworktree、このリポジトリ外にある旧サイト資産は正本ではありません。旧資産を根拠に判断しません。

## 既存ルールとの関係

このファイルは既存ルールを再記述しません。次の2つを正本として参照します。

- 役割分担・作業ルール・Codexへの依頼・機密情報の取り扱い: [docs/development/AI_DEVELOPMENT_GUIDE.md](docs/development/AI_DEVELOPMENT_GUIDE.md)
- ブランチ・コミット・PR・デプロイ確認: [docs/development/GIT_WORKFLOW.md](docs/development/GIT_WORKFLOW.md)

矛盾した場合の優先順位は、このファイル → `GIT_WORKFLOW.md` → `AI_DEVELOPMENT_GUIDE.md` です。

## 独立レビュー

- Skill、Runtime、Skill入口（`.claude/skills/` と `.agents/skills/`）、およびこのファイルの変更は、merge の前に独立レビューを受けます。`GIT_WORKFLOW.md` の「`main` 直push（例外運用）」はこれらの変更には適用しません。
- 独立レビューは、成果物の作成者とは別のAI・別セッション・別モデル、または人間が行います。同一AIが同一セッションで作成とレビューを行った場合は `Self Review` として扱い、`Approve` を確定できません。
- サイト本体の1ファイル・軽微な修正については、`GIT_WORKFLOW.md` の例外運用をそのまま維持します。この項が上書きするのは Skill・Runtime・入口・本ファイルの変更だけです。

## Skills

- 本文の実体は `docs/ai/skills/<skill-name>/SKILL.md` の1つだけです。
- `.claude/skills/<skill-name>`（Claude Code入口）と `.agents/skills/<skill-name>`（Codex入口）は、その本文への相対パスsymlinkです。`SKILL.md` をコピーしません。絶対パスの入口を作りません。
- 構成・更新手順・ランタイム別のロード検証状況は [docs/ai/skills/README.md](docs/ai/skills/README.md) を正本とします。
- 現在の対象は SK-003 `seo-growth-loop`、SK-004 `content-production`、SK-005 `ai-review` です。Skillの追加は人間の明示的な指示があってから行います。
- 共通仕様の正本は Upstream の AI Company OS Skills リポジトリです。共通仕様そのものを変える必要が生じた場合は、このリポジトリで改変せず、Upstream の変更として人間へ引き渡します。
- Skill が認識・起動しない場合、本文や入口を推測で変更せず、事実を人間へ報告します。

## 検証

- `pnpm run check`（`check:catalog` → `lint` → `typecheck` → `build`）
- `pnpm run test`

実行していない検証を、実行したと報告しません。

## 停止条件

- 正本・ブランチ・ベースが特定できないとき。
- 機密情報・認証情報・環境変数の値を出力することになるとき。
- 本番影響のある操作に人間の承認がないとき。
- 共通仕様とこのリポジトリの本文が矛盾するとき。
- 価格・送料・販売状態・食品表示に関する記述が `data/` で確認できず、人間の確認もないとき。
