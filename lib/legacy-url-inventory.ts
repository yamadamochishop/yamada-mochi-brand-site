type ArchiveEvidence = {
  kind: 'internet-archive-cdx';
  timestamp: string;
  statusCode: 200;
};

type LinkEvidence = {
  kind: 'former-page-link';
  reference: string;
};

type ConfirmedLegacyUrl = {
  status: 'confirmed';
  path: string;
  evidence: ArchiveEvidence | LinkEvidence;
  disposition: 'redirect' | 'defer';
  destination?: string;
};

type UnverifiedLegacyUrl = {
  status: 'unverified';
  candidate: string;
  basis: string;
};

const archive = (timestamp: string): ArchiveEvidence => ({
  kind: 'internet-archive-cdx',
  timestamp,
  statusCode: 200,
});

export const confirmedLegacyUrls = [
  {
    status: 'confirmed',
    path: '/商品紹介',
    evidence: archive('20240225155000'),
    disposition: 'redirect',
    destination: '/products',
  },
  {
    status: 'confirmed',
    path: '/お問い合わせ',
    evidence: archive('20240225151300'),
    disposition: 'redirect',
    destination: '/contact',
  },
  {
    status: 'confirmed',
    path: '/アレンジレシピ',
    evidence: archive('20240225163707'),
    disposition: 'defer',
  },
  {
    status: 'confirmed',
    path: '/アレンジレシピ/餅のアレンジレシピ',
    evidence: archive('20240225143849'),
    disposition: 'defer',
  },
  {
    status: 'confirmed',
    path: '/アレンジレシピ/漬物のアレンジレシピ',
    evidence: archive('20240225135752'),
    disposition: 'defer',
  },
  {
    status: 'confirmed',
    path: '/アレンジレシピ/お米-米粉のアレンジレシピ',
    evidence: archive('20240225153146'),
    disposition: 'defer',
  },
  {
    status: 'confirmed',
    path: '/通販-https-yamadamochi-thebase-in',
    evidence: archive('20240225143515'),
    disposition: 'defer',
  },
  {
    status: 'confirmed',
    path: '/2020/06/05/カプレーゼ餅',
    evidence: archive('20240225152052'),
    disposition: 'defer',
  },
  {
    status: 'confirmed',
    path: '/2020/06/05/ゴルゴンゾーラ餅',
    evidence: archive('20240225160959'),
    disposition: 'defer',
  },
  {
    status: 'confirmed',
    path: '/2020/06/11/ピザ餅',
    evidence: archive('20240225150436'),
    disposition: 'defer',
  },
  {
    status: 'confirmed',
    path: '/2020/06/11/明太子マヨ餅',
    evidence: archive('20240225161938'),
    disposition: 'defer',
  },
  {
    status: 'confirmed',
    path: '/2020/06/11/草もちあんこバター',
    evidence: archive('20240225140111'),
    disposition: 'defer',
  },
  {
    status: 'confirmed',
    path: '/2020/06/11/餅アヒージョ',
    evidence: archive('20240225153847'),
    disposition: 'defer',
  },
  {
    status: 'confirmed',
    path: '/2020/09/23/ガーリックバター餅',
    evidence: archive('20240225162343'),
    disposition: 'defer',
  },
  {
    status: 'confirmed',
    path: '/2020/09/23/漬物ステーキ',
    evidence: archive('20240225162302'),
    disposition: 'defer',
  },
  {
    status: 'confirmed',
    path: '/2020/10/09/たくあんクリームチーズ',
    evidence: archive('20240225161653'),
    disposition: 'defer',
  },
  {
    status: 'confirmed',
    path: '/2020/10/09/米粉どらやき',
    evidence: archive('20240225151343'),
    disposition: 'defer',
  },
  {
    status: 'confirmed',
    path: '/2021/01/05/もち玄米トマトリゾット風',
    evidence: archive('20240225162224'),
    disposition: 'defer',
  },
  {
    status: 'confirmed',
    path: '/2021/01/10/もち玄米の豆乳クリームリゾット風',
    evidence: archive('20240225162423'),
    disposition: 'defer',
  },
  {
    status: 'confirmed',
    path: '/2021/03/05/チーズゴマ海老餅',
    evidence: archive('20240225150835'),
    disposition: 'defer',
  },
  {
    status: 'confirmed',
    path: '/2021/08/20/もち玄米チーズリゾット風',
    evidence: archive('20240225153539'),
    disposition: 'defer',
  },
  {
    status: 'confirmed',
    path: '/about',
    evidence: archive('20240225151509'),
    disposition: 'defer',
  },
  {
    status: 'confirmed',
    path: '/j/privacy',
    evidence: {
      kind: 'former-page-link',
      reference: '旧レシピ記事footerのプライバシーポリシーリンク',
    },
    disposition: 'defer',
  },
  {
    status: 'confirmed',
    path: '/sitemap',
    evidence: archive('20240416082319'),
    disposition: 'defer',
  },
] as const satisfies readonly ConfirmedLegacyUrl[];

// Candidates without a page link, archive record, repository source, or other
// public evidence belong here and must never be added to the redirect manifest.
export const unverifiedLegacyUrls = [] as const satisfies readonly UnverifiedLegacyUrl[];
