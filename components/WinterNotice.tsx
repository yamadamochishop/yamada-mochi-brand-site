'use client';

import { useEffect, useState } from 'react';
import { winterCampaign } from '@/data/winter-campaign';
import { isCampaignActive, nextBoundary, winterNoticeRows } from '@/lib/campaign';

const MAX_TIMEOUT_MS = 2 ** 31 - 1;

export function WinterNotice() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    if (winterCampaign.confirmedAt === null) return;

    let timer: ReturnType<typeof setTimeout> | null = null;
    const update = () => {
      if (timer !== null) clearTimeout(timer);
      const current = new Date();
      setNow(current);
      const boundary = nextBoundary(winterCampaign, current);
      if (boundary !== null) {
        timer = setTimeout(
          update,
          Math.min(Math.max(boundary.getTime() - current.getTime(), 0), MAX_TIMEOUT_MS),
        );
      }
    };
    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') update();
    };

    update();
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => {
      if (timer !== null) clearTimeout(timer);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, []);

  if (now === null || winterCampaign.heading === null || !isCampaignActive(winterCampaign, now)) {
    return null;
  }

  const rows = winterNoticeRows(winterCampaign, now);
  if (rows.length === 0) return null;

  return (
    <aside
      aria-label={winterCampaign.heading}
      className="mb-6 border border-sumi/20 bg-white/50 p-5"
    >
      <h3 className="font-serifjp text-lg text-sumi">{winterCampaign.heading}</h3>
      <ul className="mt-3 space-y-1">
        {rows.map((row) => (
          <li key={row}>{row}</li>
        ))}
      </ul>
    </aside>
  );
}
