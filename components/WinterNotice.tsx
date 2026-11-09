'use client';

import { useEffect, useState } from 'react';
import { winterCampaign } from '@/data/winter-campaign';
import { isCampaignActive, nextBoundary, winterNoticeRows } from '@/lib/campaign';

const MAX_TIMEOUT_MS = 2 ** 31 - 1;

export function WinterNotice({ headingLevel = 3 }: { headingLevel?: 2 | 3 }) {
  const Heading = headingLevel === 2 ? 'h2' : 'h3';
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

  if (now === null || !isCampaignActive(winterCampaign, now)) {
    return null;
  }

  const rows = winterNoticeRows(winterCampaign, now);
  if (rows.length === 0) return null;

  return (
    <aside
      aria-label={winterCampaign.heading}
      className="mb-6 border border-sumi/20 bg-white/50 p-5"
    >
      <Heading className="font-serifjp text-lg text-sumi">{winterCampaign.heading}</Heading>
      <ul className="mt-3 space-y-1">
        {rows.map((row) => (
          <li key={row}>
            {row
              .split(/(\d{4}年\d{1,2}月\d{1,2}日（[日月火水木金土]）|\d{2}:\d{2}（日本時間）)/u)
              .map((part, index) => (
                <span
                  key={index}
                  className={index % 2 === 1 ? 'inline-block whitespace-nowrap' : undefined}
                >
                  {part}
                </span>
              ))}
          </li>
        ))}
      </ul>
      <p className="mt-3">年内発送分の受付締切であり、年内の到着を保証するものではありません。</p>
      <p>年末年始は、通常の発送目安と異なります。</p>
      <p>発送再開日は到着日ではありません。</p>
    </aside>
  );
}
