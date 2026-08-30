# AI Skills（山田もち店ブランドサイト）

Claude Code と Codex から共通利用する Skill を管理する。

## 構成

| 役割               | 場所                                                         |
| ------------------ | ------------------------------------------------------------ |
| 本文（正本、実体） | `docs/ai/skills/<skill-name>/SKILL.md`                       |
| Claude Code 入口   | `.claude/skills/<skill-name>` → 上のディレクトリへの symlink |
| Codex 入口         | `.agents/skills/<skill-name>` → 上のディレクトリへの symlink |

本文の実体は `docs/ai/skills/` 配下の1つだけとする。`.claude/skills/` と `.agents/skills/` は symlink の入口であり、そこへ `SKILL.md` を手作業でコピーしない。同じ本文を複数ファイルで管理しない。

symlink は必ず相対パスで張る。絶対パスの入口は clone・worktree・別マシンで解決できず、この方式の失敗例として実在する。

## 現在の Skill

| Skill                | Upstream ID | Upstream version | 本文                                         | 位置づけ           |
| -------------------- | ----------- | ---------------- | -------------------------------------------- | ------------------ |
| `seo-growth-loop`    | SK-003      | 0.1.1（Draft）   | `docs/ai/skills/seo-growth-loop/SKILL.md`    | Project Adaptation |
| `content-production` | SK-004      | 0.1.1（Draft）   | `docs/ai/skills/content-production/SKILL.md` | Project Adaptation |
| `ai-review`          | SK-005      | 0.1.0（Draft）   | `docs/ai/skills/ai-review/SKILL.md`          | Project Adaptation |

3件とも Upstream 本文そのままの複製ではなく、Upstream 共通仕様に山田もち店ブランドサイト固有の Project Adaptation を加えた実行用本文である。Upstream の禁止事項・Human Gate・停止条件は継承し、緩めない。各本文の `Skill Identity` 表に同じ Upstream ID と version を記載する。この表と本文の `Skill Identity` は同じ変更で一致させる。

SK-001 `project-startup-audit` と SK-002 `safe-web-change` はこのリポジトリへ未配置である。必要になった時点で、同じ手順で人間の指示のもとに追加する。

## ランタイム別ロード検証

確認粒度を「カタログ認識」と「明示起動」に分けて記録する。粒度をまとめない。未確認のものを確認済みと書かない。

| ランタイム  | カタログ認識（SK-003 / SK-004 / SK-005） | 明示起動                                                              | 確認日     |
| ----------- | ---------------------------------------- | --------------------------------------------------------------------- | ---------- |
| Claude Code | 3件とも PASS                             | `/seo-growth-loop` PASS。`/content-production`・`/ai-review` は未確認 | 2026-08-30 |
| Codex       | 3件とも PASS                             | `$seo-growth-loop` PASS。`$content-production`・`$ai-review` は未確認 | 2026-08-30 |

検証の内容と根拠は次のとおりとする。

- カタログ認識: 新規セッションの Skill 一覧に3件が現れ、その description が `docs/ai/skills/<skill-name>/SKILL.md` の frontmatter と一致すること。
- 明示起動: 起動記法で Skill が起動し、ロードされた本文が `docs/ai/skills/<skill-name>/SKILL.md` の内容であること。Claude Code の実測では、起動時の base directory が `.claude/skills/seo-growth-loop`（symlink 入口）として報告され、本文が実体ファイルと一致した。
- 起動確認は起動の成否のみを見る。Skill 本来の作業（分析・執筆・レビュー）へは進めない。
- Claude Code の記録はこのリポジトリでの実測による。Codex の記録は Codex セッションでの実測結果を人間が報告したものを転記した。
- 入口を作成したセッションの内部ではロードを確認できない。入口の追加・変更後は、各ランタイムで新しいセッションを開始してから確認する。

未確認の欄を埋めるには、対象ランタイムで新しいセッションを開始し、`/content-production`・`/ai-review`（Codex では `$content-production`・`$ai-review`）を明示起動して、この表を更新する。どちらかが起動しない場合、本文や入口を推測で変更せず、事実を人間へ報告する。

## 入口の symlink

`.claude/skills/<skill-name>` と `.agents/skills/<skill-name>` は、git 上でも symlink（mode `120000`）として記録する。確認する。

```sh
git ls-files -s .claude/skills .agents/skills
```

`120000` 以外、たとえば `100644` で記録されていれば、入口が通常ファイルになっている。`core.symlinks=false` の checkout（symlink を作成できない環境）では、git は symlink をリンク先のパス文字列を書いた通常ファイルとして展開する。その状態では Skill はロードされず、入口を編集すると本文の二重管理が始まる。

そうなった checkout では、入口ファイルを編集も commit もしない。ロードできないという事実を人間へ報告する。復旧は checkout 側の設定で行い、本文のコピーで代替しない。

## Upstream との関係

共通仕様・受入テスト・変更履歴の正本は AI Company OS Skills リポジトリにある。このリポジトリに置くのは、その共通仕様に Project Adaptation を加えた実行用本文で、共通仕様の禁止事項を緩めない。

| 項目                | 値                                                            |
| ------------------- | ------------------------------------------------------------- |
| Upstream            | AI Company OS Skills                                          |
| repository          | `https://github.com/yamadamochishop/ai-company-os-skills.git` |
| 参照 commit（不変） | `edfe65baec0323c78f393ce2de3f5ae3567faf85`                    |
| その commit の件名  | `feat: core skills v0.1.1 hotfix batch A (#5)`                |
| 参照日              | 2026-08-30                                                    |

版数は branch 名ではなくこの commit SHA を不変の参照点とする。`main` は移動するため、対応関係の記録には使わない。この commit における各 Skill の版数は次のとおりで、上の「現在の Skill」表と一致する。

| Skill                | Upstream ID | Upstream version | 版数の出所（Upstream 内）                                |
| -------------------- | ----------- | ---------------- | -------------------------------------------------------- |
| `seo-growth-loop`    | SK-003      | 0.1.1（Draft）   | `specifications/SK-003-seo-growth-loop/metadata.yaml`    |
| `content-production` | SK-004      | 0.1.1（Draft）   | `specifications/SK-004-content-production/metadata.yaml` |
| `ai-review`          | SK-005      | 0.1.0（Draft）   | `specifications/SK-005-ai-review/metadata.yaml`          |

本文の比較対象は、同 commit の `runtimes/claude/skills/<skill-name>/SKILL.md` と `specifications/SK-00x-*/SPEC.md` である。Upstream は Claude Code 用と Codex 用に本文を二重管理しているが、このリポジトリでは単一本文へ集約し、起動記法の違い（Claude Code は `/<skill-name>`、Codex は `$<skill-name>`）は本文内で併記して吸収する。

Upstream の絶対パスは本文へ固定しない。ローカルの clone 位置に依存する記述は、別マシンや fresh clone で解決できない。上記の repository URL と commit SHA だけを対応関係の記録に使う。

Upstream の共通仕様そのものを変更する必要が生じた場合は、このリポジトリで改変せず、Upstream 側の変更として人間へ引き渡す。

## 追加・更新の手順

1. `docs/ai/skills/<skill-name>/SKILL.md` を追加または更新する。
2. `.claude/skills/` と `.agents/skills/` に、まだ無ければ相対パスの symlink 入口を作る。
3. 各ランタイムで新しいセッションを開始し、カタログ認識と明示起動を確認して、「ランタイム別ロード検証」の表へ粒度どおりに反映する。
4. Upstream version を更新したときは、参照 commit SHA、「現在の Skill」表、「Upstream との関係」の版数表、各本文の `Skill Identity` を同じ変更で合わせる。
5. 既存 Skill の状態（ランタイムごとの検証状況など）が変わったときも、同じ変更で表を更新する。

Skill・Runtime・入口の変更は、`AGENTS.md` により merge 前の独立レビューを必須とする。
