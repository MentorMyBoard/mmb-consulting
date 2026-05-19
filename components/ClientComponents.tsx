'use client';
import dynamic from 'next/dynamic';

const WhatsAppButton = dynamic(() => import('@/components/WhatsAppButton'), { ssr: false });
const LoadingScreen = dynamic(() => import('@/components/LoadingScreen'), { ssr: false });

export function ClientComponents() {
  return (
    <>
      <LoadingScreen />
      <WhatsAppButton />
    </>
  );
}
