import { splitPhrases } from '@/lib/phrases';

/**
 * 読点「、」の直後でだけ折り返す和文テキスト。
 *
 * 「米のおいしさを、そのまま味わ／う。」のように、見出しの末尾1〜2文字だけが
 * 次の行に残る折り返しを防ぐ。各句を `.ym-phrase`（inline-block）でまとめるため、
 * Safariを含むすべてのブラウザで効く。
 */
export function PhraseText({ text }: { text: string }) {
  return (
    <>
      {splitPhrases(text).map((phrase, index) => (
        <span key={index} className="ym-phrase">
          {phrase}
        </span>
      ))}
    </>
  );
}
