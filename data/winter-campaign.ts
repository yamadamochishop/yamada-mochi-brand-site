export type WinterCampaign = {
  heading: string;
  displayFrom: string | null;
  displayUntil: string | null;
  ambientOrderDeadline: string | null;
  frozenOrderDeadline: string | null;
  lastShipDate: string | null;
  newYearShipStart: string | null;
  confirmedAt: string | null;
};

export const winterCampaign: WinterCampaign = {
  heading: '年末年始のお届けについて',
  displayFrom: '2026-11-09T00:00:00+09:00',
  displayUntil: '2027-01-04T00:00:00+09:00',
  ambientOrderDeadline: '2026-12-20T17:00:00+09:00',
  frozenOrderDeadline: '2026-12-20T17:00:00+09:00',
  lastShipDate: '2026-12-30T00:00:00+09:00',
  newYearShipStart: '2027-01-03T00:00:00+09:00',
  confirmedAt: '2026-10-12T00:00:00+09:00',
};
