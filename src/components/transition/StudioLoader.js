/*
 * Adapted from “Coffee Espresso Machine Awesome Animated Loader” by 3bdel3ziz-T.
 * Source: https://uiverse.io/3bdel3ziz-T/strong-gecko-19
 * Licensed under the MIT License.
 */
import React, {useLayoutEffect, useRef} from 'react';
import Style from './StudioLoader.module.scss';
import coffeeMachine from '../../assets/transition/coffee-machine-optimized.png';
import studioLoaderBackground from '../../assets/transition/studio-loader-background.webp';

export default function StudioLoader({reducedMotion = false, isExiting = false}) {
   const scaleFrameRef = useRef(null);

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

   return (
      <div
         className={`${Style.overlay} ${reducedMotion ? Style.reducedMotion : ''} ${isExiting ? Style.overlayExiting : ''}`}
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
