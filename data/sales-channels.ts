import type { SalesChannel } from '../types/content-model.ts';

/**
 * Shared channel registry. `active` is omitted when operational availability
 * has not been verified; omission must not be interpreted as inactive.
 */
export const salesChannels: SalesChannel[] = [
  {
    id: 'jinya-morning-market',
    name: '陣屋前朝市',
    type: 'morning_market',
    location: '飛騨高山・陣屋前朝市',
  },
  {
    id: 'base',
    name: 'BASE',
    type: 'base',
    url: 'https://yamadamochi.thebase.in',
    active: true,
  },
  {
    id: 'furusato-tax',
    name: 'ふるさと納税',
    type: 'furusato_tax',
  },
  {
    id: 'retail-store',
    name: '店頭',
    type: 'store',
  },
  {
    id: 'chilled-shipping',
    name: '冷蔵通販',
    type: 'chilled_shipping',
  },
  {
    id: 'frozen-shipping',
    name: '冷凍通販',
    type: 'frozen_shipping',
  },
  {
    id: 'other',
    name: 'その他',
    type: 'other',
  },
];
