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
  displayFrom: null,
  displayUntil: null,
  ambientOrderDeadline: null,
  frozenOrderDeadline: null,
  lastShipDate: null,
  newYearShipStart: null,
  confirmedAt: null,
};
