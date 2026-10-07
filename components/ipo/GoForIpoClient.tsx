'use client';

import { useEffect, useRef, useState } from 'react';
import { IPO_STYLES, IPO_MARKUP, IPO_RUNTIME_FN_SRC, IPO_DATA } from './ipoPageContent';
import { LeadCaptureModal } from './LeadCaptureModal';
import { ConsultNowModal } from './ConsultNowModal';

const ROOT_ID = 'mmb-ipo-primer';

export function GoForIpoClient({ consultNowUrl, logoUrl }: { consultNowUrl: string; logoUrl: string }) {
  const [showLead, setShowLead] = useState(false);
  const [showCta, setShowCta] = useState(false);
  const leadShownRef = useRef(false);
  const ctaShownRef = useRef(false);

  useEffect(() => {
    // Real MMB logo on the dark cover; the footer slot (light background)
    // intentionally keeps the runtime's own navy fallback mark instead of
    // this logo, which renders in white and would be unreadable there.
    const data = { ...IPO_DATA, settings: { ...IPO_DATA.settings, logo: logoUrl, logoDark: '' } };

    const script = document.createElement('script');
    script.textContent = `${IPO_RUNTIME_FN_SRC}\nmmbRuntime(document.getElementById(${JSON.stringify(ROOT_ID)}), ${JSON.stringify(data)});`;
    document.body.appendChild(script);

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

      if (!leadShownRef.current) {
        leadShownRef.current = true;
        setShowLead(true);
      }

      // Defer slightly: the runtime's own click handler (bound directly to
      // this same button) runs first and sets `disabled` synchronously, but
      // this small delay is a harmless safety margin either way.
      setTimeout(() => {
        if (ctaShownRef.current) return;
        const { answered, total } = countAnsweredQuizQuestions();
        if (total > 0 && answered === total) {
          ctaShownRef.current = true;
          setShowCta(true);
        }
      }, 0);
    }

    document.addEventListener('click', onClick);
    return () => {
      document.removeEventListener('click', onClick);
      script.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: IPO_STYLES }} />
      <div dangerouslySetInnerHTML={{ __html: IPO_MARKUP }} />
      {showLead && <LeadCaptureModal onClose={() => setShowLead(false)} />}
      {showCta && <ConsultNowModal consultNowUrl={consultNowUrl} onClose={() => setShowCta(false)} />}
    </>
  );
}
