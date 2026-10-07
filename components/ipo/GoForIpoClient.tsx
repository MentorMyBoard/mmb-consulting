'use client';

import { memo, useCallback, useEffect, useState } from 'react';
import { IPO_STYLES, IPO_MARKUP, IPO_RUNTIME_FN_SRC, IPO_DATA } from './ipoPageContent';
import { LeadCaptureModal } from './LeadCaptureModal';
import { ConsultNowModal } from './ConsultNowModal';

const ROOT_ID = 'mmb-ipo-primer';

/**
 * Hosts the injected widget markup/script in its own memoized component so
 * it NEVER re-renders after mount. The widget's runtime script builds the
 * quiz/self-check/etc. content imperatively, outside React — if this
 * component re-rendered (e.g. because a sibling popup's visibility state
 * changed), React would reset the dangerouslySetInnerHTML div back to its
 * pristine (empty-widget) markup and silently wipe out everything the
 * script had built, which is exactly what was happening before this split.
 */
const IpoWidget = memo(function IpoWidget({
  logoUrl,
  onFirstQuizAnswer,
  onQuizComplete,
}: {
  logoUrl: string;
  onFirstQuizAnswer: () => void;
  onQuizComplete: () => void;
}) {
  useEffect(() => {
    // Real MMB logo on the dark cover; the footer slot (light background)
    // intentionally keeps the runtime's own navy fallback mark instead of
    // this logo, which renders in white and would be unreadable there.
    const data = { ...IPO_DATA, settings: { ...IPO_DATA.settings, logo: logoUrl, logoDark: '' } };

    const script = document.createElement('script');
    script.textContent = `${IPO_RUNTIME_FN_SRC}\nmmbRuntime(document.getElementById(${JSON.stringify(ROOT_ID)}), ${JSON.stringify(data)});`;
    document.body.appendChild(script);

    let leadShown = false;
    let ctaShown = false;

    function countAnsweredQuizQuestions(): { answered: number; total: number } {
      const root = document.getElementById(ROOT_ID);
      if (!root) return { answered: 0, total: 0 };
      const questions = root.querySelectorAll('[data-widget="quiz"] .kp-q');
      let answered = 0;
      questions.forEach((question) => {
        const firstBtn = question.querySelector('.kp-choices button') as HTMLButtonElement | null;
        if (firstBtn?.disabled) answered++;
      });
      return { answered, total: questions.length };
    }

    function onClick(e: MouseEvent) {
      const target = e.target as HTMLElement;
      const quizAnswerBtn = target.closest('[data-widget="quiz"] .kp-choices button');
      if (!quizAnswerBtn) return;

      if (!leadShown) {
        leadShown = true;
        onFirstQuizAnswer();
      }

      // Defer slightly: the runtime's own click handler (bound directly to
      // this same button) runs first and sets `disabled` synchronously, but
      // this small delay is a harmless safety margin either way.
      setTimeout(() => {
        if (ctaShown) return;
        const { answered, total } = countAnsweredQuizQuestions();
        if (total > 0 && answered === total) {
          ctaShown = true;
          onQuizComplete();
        }
      }, 0);
    }

    document.addEventListener('click', onClick);
    return () => {
      document.removeEventListener('click', onClick);
      script.remove();
    };
    // Intentionally mount-once: re-running this would re-inject the script
    // and rebuild every widget from scratch.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: IPO_STYLES }} />
      <div dangerouslySetInnerHTML={{ __html: IPO_MARKUP }} />
    </>
  );
});

export function GoForIpoClient({ consultNowUrl, logoUrl }: { consultNowUrl: string; logoUrl: string }) {
  const [showLead, setShowLead] = useState(false);
  const [showCta, setShowCta] = useState(false);

  // Stable references so IpoWidget's memoization actually holds.
  const handleFirstQuizAnswer = useCallback(() => setShowLead(true), []);
  const handleQuizComplete = useCallback(() => setShowCta(true), []);
  const closeLead = useCallback(() => setShowLead(false), []);
  const closeCta = useCallback(() => setShowCta(false), []);

  return (
    <>
      <IpoWidget
        logoUrl={logoUrl}
        onFirstQuizAnswer={handleFirstQuizAnswer}
        onQuizComplete={handleQuizComplete}
      />
      {showLead && <LeadCaptureModal onClose={closeLead} />}
      {showCta && <ConsultNowModal consultNowUrl={consultNowUrl} onClose={closeCta} />}
    </>
  );
}
