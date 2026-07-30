'use client';
import dynamic from 'next/dynamic';

const WhatsAppButton = dynamic(() => import('@/components/WhatsAppButton'), { ssr: false });
const LoadingScreen = dynamic(() => import('@/components/LoadingScreen'), { ssr: false });
const PromoPopup = dynamic(() => import('@/components/PromoPopup'), { ssr: false });
const AnalyticsTracker = dynamic(() => import('@/components/AnalyticsTracker'), { ssr: false });

export function ClientComponents() {
  return (
    <>
      <LoadingScreen />
      <WhatsAppButton />
      <PromoPopup />
      <AnalyticsTracker />
    </>
  );
}
