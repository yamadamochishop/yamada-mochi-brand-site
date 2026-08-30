# CLAUDE.md — Claude Code 補足

[AGENTS.md](AGENTS.md) がこのリポジトリのAIエージェント共通の規則です。先に読み、それに従います。このファイルはClaude Code固有の事項だけを足します。両者が食い違う場合は `AGENTS.md` が優先します。

`AGENTS.md` の内容はここで再記述・要約・言い換えしません。正本、独立レビュー、Skillsの構成、検証コマンド、停止条件はすべて `AGENTS.md` にあります。

## Skill の起動記法

- Claude Code は `/seo-growth-loop`、`/content-production`、`/ai-review` で起動します。
- Codex の `$` 記法は `.agents/skills/` 側の入口のものです。Claude Code の報告に混ぜません。
- ランタイムごとのロード確認状況は `docs/ai/skills/README.md` の表を見ます。未確認のランタイムを確認済みとして扱いません。

## 役割

- `docs/development/AI_DEVELOPMENT_GUIDE.md` の役割分担では、Claude Code が進行管理・レビュー・Git管理・デプロイを担当し、Codex が実装を担当します。
- Claude Code 自身が実装した変更は、その独立レビューを Codex または人間へ回します。自分が作った成果物を自分でレビューして `Approve` としません。
- `/ai-review` を Claude Code が同一セッションで自分の成果物に対して使った場合は `Self Review` です。`Approve` を確定できません。
