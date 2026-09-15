import React, {useCallback, useEffect, useRef, useState} from 'react';
import styles from './OrientationHint.module.scss';

const ORIENTATION_QUERY = '(max-width: 768px) and (orientation: portrait)';
const SESSION_KEY = 'joyce-orientation-hint-dismissed';
const EXIT_DURATION = 250;

const hasBeenDismissed = () => {
   try {
      return window.sessionStorage.getItem(SESSION_KEY) === 'true';
   } catch (error) {
      return false;
   }
};

const rememberDismissal = () => {
   try {
      window.sessionStorage.setItem(SESSION_KEY, 'true');
   } catch (error) {
      // The hint still closes when storage is unavailable.
   }
};

function OrientationHint() {
   const [isMounted, setIsMounted] = useState(false);
   const [isVisible, setIsVisible] = useState(false);
   const shownRef = useRef(false);
   const exitTimerRef = useRef(null);
   const frameRef = useRef(null);

   const dismiss = useCallback(() => {
      rememberDismissal();
      shownRef.current = false;
      setIsVisible(false);

      window.clearTimeout(exitTimerRef.current);
      exitTimerRef.current = window.setTimeout(() => {
         setIsMounted(false);
      }, EXIT_DURATION);
   }, []);

   useEffect(() => {
      const mediaQuery = window.matchMedia(ORIENTATION_QUERY);

      const show = () => {
         if (hasBeenDismissed() || shownRef.current) return;

         window.clearTimeout(exitTimerRef.current);
         shownRef.current = true;
         setIsMounted(true);
         frameRef.current = window.requestAnimationFrame(() => {
            setIsVisible(true);
         });
      };

      const handleMediaChange = (event) => {
         if (event.matches) {
            show();
         } else if (shownRef.current) {
            dismiss();
         }
      };

      if (mediaQuery.matches) show();

      if (mediaQuery.addEventListener) {
         mediaQuery.addEventListener('change', handleMediaChange);
      } else {
         mediaQuery.addListener(handleMediaChange);
      }

      return () => {
         window.cancelAnimationFrame(frameRef.current);
         window.clearTimeout(exitTimerRef.current);
         if (mediaQuery.removeEventListener) {
            mediaQuery.removeEventListener('change', handleMediaChange);
         } else {
            mediaQuery.removeListener(handleMediaChange);
         }
      };
   }, [dismiss]);

   if (!isMounted) return null;

   return (
      <div
         className={`${styles.overlay} ${isVisible ? styles.visible : ''}`}
         role="dialog"
         aria-modal="true"
         aria-label="横屏浏览提示"
      >
         <div className={styles.content}>
            <div className={styles.rotateIcon} aria-hidden="true">↻</div>
            <p className={styles.title}>横过来看看吧</p>
            <p className={styles.subtitle}>横屏浏览体验更佳</p>
            <button className={styles.continueButton} type="button" onClick={dismiss}>
               继续竖屏浏览
            </button>
         </div>
      </div>
   );
}

export default OrientationHint;
