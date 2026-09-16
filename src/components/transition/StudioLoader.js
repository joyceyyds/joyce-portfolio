/*
 * Adapted from “Coffee Espresso Machine Awesome Animated Loader” by 3bdel3ziz-T.
 * Source: https://uiverse.io/3bdel3ziz-T/strong-gecko-19
 * Licensed under the MIT License.
 */
import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import Style from './StudioLoader.module.scss';
import coffeeMachine from '../../assets/transition/coffee-machine-optimized.png';
import studioLoaderBackground from '../../assets/transition/studio-loader-background.webp';
import {preloadImages} from '../../utils/preloadImages';

const LOADER_CRITICAL_IMAGES = [studioLoaderBackground, coffeeMachine];

export default function StudioLoader({reducedMotion = false, isExiting = false, onReady}) {
   const [isReadyToShow, setIsReadyToShow] = useState(false);
   const scaleFrameRef = useRef(null);
   const onReadyRef = useRef(onReady);
   const hasReportedReadyRef = useRef(false);

   useEffect(() => {
      onReadyRef.current = onReady;
   }, [onReady]);

   useLayoutEffect(() => {
      const scaleFrame = scaleFrameRef.current;
      if (!scaleFrame) return undefined;

      const updateScale = () => {
         scaleFrame.style.setProperty('--loader-canvas-scale', `${scaleFrame.clientWidth / 1672}`);
      };

      updateScale();
      const resizeObserver = new ResizeObserver(updateScale);
      resizeObserver.observe(scaleFrame);
      return () => resizeObserver.disconnect();
   }, []);

   useEffect(() => {
      let isMounted = true;
      let firstPaintFrame;
      let secondPaintFrame;
      let visiblePaintFrame;

      preloadImages(LOADER_CRITICAL_IMAGES).then(() => {
         if (!isMounted) return;
         firstPaintFrame = window.requestAnimationFrame(() => {
            secondPaintFrame = window.requestAnimationFrame(() => {
               if (!isMounted) return;
               setIsReadyToShow(true);
               visiblePaintFrame = window.requestAnimationFrame(() => {
                  if (!isMounted || hasReportedReadyRef.current) return;
                  hasReportedReadyRef.current = true;
                  onReadyRef.current?.();
               });
            });
         });
      });

      return () => {
         isMounted = false;
         if (firstPaintFrame) window.cancelAnimationFrame(firstPaintFrame);
         if (secondPaintFrame) window.cancelAnimationFrame(secondPaintFrame);
         if (visiblePaintFrame) window.cancelAnimationFrame(visiblePaintFrame);
      };
   }, []);

   return (
      <div
         className={`${Style.overlay} ${isReadyToShow ? Style.overlayReady : ''} ${reducedMotion ? Style.reducedMotion : ''} ${isExiting ? Style.overlayExiting : ''}`}
         role={'status'}
         aria-live={'polite'}
         aria-label={'Making coffee before entering Joyce’s studio'}
      >
         <div ref={scaleFrameRef} className={Style.sceneFrame} aria-hidden={'true'}>
          <div className={Style.scene}>
            <img className={Style.background} src={studioLoaderBackground} alt={''} />
            <p className={Style.coffeeMessage}>Coffee first, then we begin.</p>
            <div className={Style.coffeeVisual}>
               <img className={Style.coffeeMachine} src={coffeeMachine} alt={''} />
               <div className={Style.coffeeFlow}></div>
               <div className={Style.steamLayer}>
                  <div className={`${Style.smoke} ${Style.one}`}></div>
                  <div className={`${Style.smoke} ${Style.two}`}></div>
                  <div className={`${Style.smoke} ${Style.three}`}></div>
                  <div className={`${Style.smoke} ${Style.four}`}></div>
               </div>
            </div>
          </div>
         </div>
      </div>
   );
}
