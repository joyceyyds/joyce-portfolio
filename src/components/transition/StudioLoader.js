/*
 * Adapted from “Coffee Espresso Machine Awesome Animated Loader” by 3bdel3ziz-T.
 * Source: https://uiverse.io/3bdel3ziz-T/strong-gecko-19
 * Licensed under the MIT License.
 */
import React from 'react';
import Style from './StudioLoader.module.scss';
import coffeeMachine from '../../assets/transition/coffee-machine-optimized.png';
import studioLoaderBackground from '../../assets/transition/studio-loader-background.webp';

export default function StudioLoader({reducedMotion = false, isExiting = false}) {
   return (
      <div
         className={`${Style.overlay} ${reducedMotion ? Style.reducedMotion : ''} ${isExiting ? Style.overlayExiting : ''}`}
         role={'status'}
         aria-live={'polite'}
         aria-label={'Making coffee before entering Joyce’s studio'}
      >
         <div className={Style.scene} aria-hidden={'true'}>
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
   );
}
