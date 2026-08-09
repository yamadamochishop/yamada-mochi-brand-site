import type { SalesLocation } from '../types/content-model.ts';

/** Physical sales locations are kept separate from online commerce channels. */
export const salesLocations: SalesLocation[] = [
  {
    id: 'jinya-morning-market',
    name: '陣屋前朝市',
    type: 'morning_market',
    active: true,
  },
];
