/**
 * GA4を読み込むかどうかの判定。
 *
 * 本番GA4へ送るのは Vercel の Production デプロイだけにする。
 * `VERCEL_ENV` は Vercel がビルド時に自動で設定する（production / preview / development）。
 * ローカルの `next dev`・`next build && next start` では未設定、Preview では `preview` になるため、
 * どちらも GA4 を読み込まない。イベント送信は `window.gtag?.()` 経由なので、
 * gtag が無い環境では何も送られず、テストではモックの `window.gtag` で検証できる。
 */

/** GA4の測定IDは公開値。Production で環境変数が未設定でも計測が途切れないよう既定値を持つ。 */
export const DEFAULT_GA_MEASUREMENT_ID = 'G-G4QWYR6EH4';

export function resolveGaMeasurementId({
  vercelEnv,
  configuredId,
}: {
  vercelEnv: string | undefined;
  configuredId: string | undefined;
}): string | undefined {
  if (vercelEnv !== 'production') return undefined;
  return configuredId || DEFAULT_GA_MEASUREMENT_ID;
}
