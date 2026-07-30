'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import type { PopupDTO, PopupPosition } from '@/lib/types';

const EASE = [0.16, 1, 0.3, 1] as const;

/** Fire-and-forget — a failed ping should never affect the visitor's experience. */
function trackEvent(type: 'page_view' | 'popup_click', popupId?: string) {
  fetch('/api/analytics/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type, popupId }),
  }).catch(() => {});
}

/** Container layout + slide-in origin per screen position. */
const POSITION_CONFIG: Record<PopupPosition, { containerClass: string; initial: { x?: number; y?: number } }> = {
  'left-top': { containerClass: 'top-24 left-4 items-start', initial: { x: -80 } },
  'left-bottom': { containerClass: 'bottom-4 left-4 items-start', initial: { x: -80 } },
  'right-top': { containerClass: 'top-24 right-4 items-end', initial: { x: 80 } },
  'right-bottom': { containerClass: 'bottom-28 right-4 items-end', initial: { x: 80 } },
  'center-top': { containerClass: 'top-24 left-1/2 -translate-x-1/2 items-center', initial: { y: -80 } },
  'center-bottom': { containerClass: 'bottom-4 left-1/2 -translate-x-1/2 items-center', initial: { y: 80 } },
};

const POSITIONS: PopupPosition[] = [
  'left-top',
  'left-bottom',
  'right-top',
  'right-bottom',
  'center-top',
  'center-bottom',
];

export default function PromoPopup() {
  const [popups, setPopups] = useState<PopupDTO[]>([]);

  useEffect(() => {
    let cancelled = false;

    // No dismissal persistence by design — every fresh page load (including a
    // reload right after closing one) should show active popups again.
    fetch('/api/popups')
      .then((res) => res.json())
      .then((json) => {
        if (cancelled || !json.ok) return;
        setPopups(json.popups as PopupDTO[]);
      })
      .catch(() => {
        // Silently no-op — a failed fetch just means no promo popups this visit.
      });

    return () => {
      cancelled = true;
    };
  }, []);

  function dismiss(id: string) {
    setPopups((prev) => prev.filter((p) => p._id !== id));
  }

  if (popups.length === 0) return null;

  return (
    <>
      {POSITIONS.map((position) => {
        const group = popups.filter((p) => p.position === position);
        if (group.length === 0) return null;

        const { containerClass, initial } = POSITION_CONFIG[position];

        return (
          <div
            key={position}
            // z-[250] — deliberately above LoadingScreen's z-[200] so promo
            // popups are visible immediately, not hidden behind the brand
            // loader while it waits on the page's images/fonts to finish.
            className={`fixed z-[250] flex flex-col gap-4 pointer-events-none ${containerClass}`}
          >
            <AnimatePresence>
              {group.map((popup) => (
                <motion.div
                  key={popup._id}
                  initial={{ opacity: 0, ...initial }}
                  animate={{ opacity: 1, x: 0, y: 0 }}
                  exit={{ opacity: 0, ...initial, transition: { duration: 0.3 } }}
                  transition={{ duration: 0.6, ease: EASE }}
                  className="relative pointer-events-auto bg-white shadow-2xl rounded-sm overflow-hidden"
                  style={{ width: popup.width, height: popup.height }}
                >
                  <button
                    onClick={() => dismiss(popup._id)}
                    aria-label="Dismiss popup"
                    className="absolute top-2 right-2 z-20 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center text-sm hover:bg-black/80 transition-colors"
                  >
                    ×
                  </button>

                  <div className="relative w-full h-full flex flex-col">
                    {/* Image doubles as a click-through target — a separate,
                        non-nested anchor from the button below, so visitors
                        have two independent ways to follow the same link. */}
                    {popup.buttonUrl ? (
                      <a
                        href={popup.buttonUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={popup.label}
                        onClick={() => trackEvent('popup_click', popup._id)}
                        className="absolute inset-0"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={popup.imageData} alt={popup.label} className="w-full h-full object-cover" />
                      </a>
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={popup.imageData}
                        alt={popup.label}
                        className="w-full h-full object-cover absolute inset-0"
                      />
                    )}

                    {popup.buttonText && popup.buttonUrl && (
                      <div className="relative z-10 mt-auto p-3 flex justify-center bg-gradient-to-t from-black/70 to-transparent pt-10">
                        <div className="border-2 border-white">
                          <Button
                            as="a"
                            href={popup.buttonUrl}
                            size="sm"
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => trackEvent('popup_click', popup._id)}
                          >
                            {popup.buttonText}
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        );
      })}
    </>
  );
}
