'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/** Pings once per page load, tagged with the current path. No visitor identity stored. */
export default function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'page_view', path: pathname }),
    }).catch(() => {});
  }, [pathname]);

  return null;
}
