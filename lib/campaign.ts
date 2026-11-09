import type { WinterCampaign } from '../data/winter-campaign.ts';

const tokyoDateFormatter = new Intl.DateTimeFormat('ja-JP', {
  timeZone: 'Asia/Tokyo',
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  weekday: 'short',
});

function campaignTime(value: string | null): number | null {
  if (!value || !/T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/u.test(value)) {
    return null;
  }
  const time = Date.parse(value);
  return Number.isNaN(time) ? null : time;
}

function displayPeriod(campaign: WinterCampaign): [number, number] | null {
  if (campaignTime(campaign.confirmedAt) === null) return null;
  const from = campaignTime(campaign.displayFrom);
  const until = campaignTime(campaign.displayUntil);
  if (from === null || until === null || from >= until) return null;
  return [from, until];
}

function tokyoDate(value: string): string {
  const parts = tokyoDateFormatter.formatToParts(new Date(value));
  const part = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((item) => item.type === type)?.value;
  return `${part('year')}年${part('month')}月${part('day')}日（${part('weekday')}）`;
}

const tokyoTimeFormatter = new Intl.DateTimeFormat('ja-JP', {
  timeZone: 'Asia/Tokyo',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
});

export function isCampaignActive(campaign: WinterCampaign, now: Date): boolean {
  const period = displayPeriod(campaign);
  return period !== null && period[0] <= now.getTime() && now.getTime() < period[1];
}

export function winterNoticeRows(campaign: WinterCampaign, now: Date): string[] {
  if (!isCampaignActive(campaign, now)) return [];

  const rows: string[] = [];
  const closedDeliveries: string[] = [];
  for (const [delivery, deadline] of [
    ['常温便', campaign.ambientOrderDeadline],
    ['冷凍便', campaign.frozenOrderDeadline],
  ] as const) {
    const time = campaignTime(deadline);
    if (time === null || deadline === null) continue;
    if (now.getTime() < time) {
      rows.push(
        `年内発送分の注文受付締切：${delivery} ${tokyoDate(deadline)} ${tokyoTimeFormatter.format(new Date(deadline))}（日本時間）`,
      );
    } else {
      closedDeliveries.push(delivery);
      rows.push(
        `${delivery}：年内発送分のご注文受付は終了しました。ネット注文は引き続き受け付けております。`,
      );
    }
  }

  if (
    closedDeliveries.length > 0 &&
    campaignTime(campaign.newYearShipStart) !== null &&
    campaign.newYearShipStart !== null
  ) {
    rows.push(
      `締切後の新規ご注文（${closedDeliveries.join('・')}）は${tokyoDate(campaign.newYearShipStart)}以降に順次発送いたします。`,
    );
  }

  if (campaignTime(campaign.lastShipDate) !== null && campaign.lastShipDate !== null) {
    rows.push(`年内の最終発送日：${tokyoDate(campaign.lastShipDate)}`);
  }
  if (campaignTime(campaign.newYearShipStart) !== null && campaign.newYearShipStart !== null) {
    rows.push(`年始の発送再開日：${tokyoDate(campaign.newYearShipStart)}`);
  }
  return rows;
}

export function nextBoundary(campaign: WinterCampaign, now: Date): Date | null {
  const period = displayPeriod(campaign);
  if (period === null) return null;

  const next = [
    ...period,
    campaignTime(campaign.ambientOrderDeadline),
    campaignTime(campaign.frozenOrderDeadline),
  ]
    .filter((time): time is number => time !== null && time > now.getTime())
    .sort((a, b) => a - b)[0];
  return next === undefined ? null : new Date(next);
}
