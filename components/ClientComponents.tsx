'use client';
import dynamic from 'next/dynamic';
import PromoPopup from '@/components/PromoPopup';
import type { PopupDTO } from '@/lib/types';

const WhatsAppButton = dynamic(() => import('@/components/WhatsAppButton'), { ssr: false });
const LoadingScreen = dynamic(() => import('@/components/LoadingScreen'), { ssr: false });
const AnalyticsTracker = dynamic(() => import('@/components/AnalyticsTracker'), { ssr: false });

export function ClientComponents({ initialPopups }: { initialPopups: PopupDTO[] }) {
  return (
    <>
      <LoadingScreen />
      <WhatsAppButton />
      {/* Not lazy-loaded like the others — it carries server-fetched data and
          needs to be part of the initial render so it's visible immediately. */}
      <PromoPopup initialPopups={initialPopups} />
      <AnalyticsTracker />
    </>
  );
}
