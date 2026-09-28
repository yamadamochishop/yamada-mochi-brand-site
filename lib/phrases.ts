/**
 * 和文を読点「、」の直後で句に分ける。句読点は前の句に残す。
 * 見出しの折り返し位置を句の境目に限るために使う（文言そのものは変えない）。
 */
export function splitPhrases(text: string): string[] {
  return text.split(/(?<=、)/u).filter(Boolean);
}
