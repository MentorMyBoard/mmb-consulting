'use client';

import { useEffect } from 'react';

/** Pings once per page load. No visual output, no visitor identity stored. */
export default function AnalyticsTracker() {
  useEffect(() => {
    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'page_view' }),
    }).catch(() => {});
  }, []);

  return null;
}
