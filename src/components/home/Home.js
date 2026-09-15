import React, {useEffect, useRef, useState} from 'react';
import {Box} from '@mui/material';
import {Link} from 'react-router-dom';
import Style from './Home.module.scss';
import homeBackground from '../../assets/home/home-background.webp';
import homeTree from '../../assets/home/home-tree.png';
import homeHouse from '../../assets/home/home-house.png';
import homeCatTail from '../../assets/home/home-cat-tail.png';
import homeSmoke from '../../assets/home/home-smoke.png';
import leaf01 from '../../assets/home/home-leaf-01.png';
import leaf02 from '../../assets/home/home-leaf-02.png';
import leaf03 from '../../assets/home/home-leaf-03.png';
import leaf04 from '../../assets/home/home-leaf-04.png';
import leaf05 from '../../assets/home/home-leaf-05.png';
import leaf06 from '../../assets/home/home-leaf-06.png';
import leafRustleSound from '../../assets/sounds/leaf-rustle.mp3';

const leafAssets = [leaf01, leaf02, leaf03, leaf04, leaf05, leaf06];
const TREE_STAGE_BOUNDS = {
   top: 0,
   left: 0,
   width: 40,
   height: 51.82,
};

function randomBetween(minimum, maximum) {
   return Math.random() * (maximum - minimum) + minimum;
}

export default function Home({innerRef, onEnterStudio}) {
   const [isTreeShaking, setIsTreeShaking] = useState(false);
   const [fallingLeaves, setFallingLeaves] = useState([]);
   const [isHomeExiting, setIsHomeExiting] = useState(false);
   const isTreeCoolingDown = useRef(false);
   const isStudioTransitioning = useRef(false);
   const leafId = useRef(0);
   const cooldownTimer = useRef(null);
   const studioEntryTimer = useRef(null);
   const treeAudioRef = useRef(null);

   useEffect(() => () => {
      clearTimeout(cooldownTimer.current);
      clearTimeout(studioEntryTimer.current);
      if (treeAudioRef.current) {
         treeAudioRef.current.pause();
         treeAudioRef.current.currentTime = 0;
      }
   }, []);

   function handleEnterStudio(event) {
      if (event) {
         event.preventDefault();
      }

      if (isStudioTransitioning.current) {
         return;
      }

      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      isStudioTransitioning.current = true;
      if (prefersReducedMotion) {
         onEnterStudio();
         return;
      }

      setIsHomeExiting(true);
      studioEntryTimer.current = setTimeout(() => {
         onEnterStudio();
      }, 250);
   }

   function handleTreeClick() {
      if (isTreeCoolingDown.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
         return;
      }

      isTreeCoolingDown.current = true;
      setIsTreeShaking(true);

      const treeAudio = treeAudioRef.current;
      if (treeAudio) {
         treeAudio.currentTime = 0;
         treeAudio.volume = 0.28;
         treeAudio.play().catch(() => {});
      }

      const leafCount = Math.floor(randomBetween(4, 7));
      const nextLeaves = Array.from({length: leafCount}, () => {
         const size = randomBetween(12, 22);
         const fallDistance = randomBetween(380, 620);
         const driftDistance = Math.random() < 0.7
            ? randomBetween(80, 220)
            : randomBetween(-80, 35);
         const rotation = randomBetween(120, 360) * (Math.random() > 0.45 ? 1 : -1);
         const canopyLeft = randomBetween(0.28, 0.91);
         const canopyTop = randomBetween(0.18, 0.54);
         const duration = size < 17
            ? randomBetween(3300, 3800)
            : randomBetween(2800, 3500);

         return {
            id: leafId.current++,
            src: leafAssets[Math.floor(Math.random() * leafAssets.length)],
            left: `${TREE_STAGE_BOUNDS.left + TREE_STAGE_BOUNDS.width * canopyLeft}%`,
            top: `${TREE_STAGE_BOUNDS.top + TREE_STAGE_BOUNDS.height * canopyTop}%`,
            size: `${size}px`,
            fallDistance: `${fallDistance}px`,
            driftDistance: `${driftDistance}px`,
            rotation: `${rotation}deg`,
            fall25: `${fallDistance * 0.22}px`,
            drift25: `${driftDistance * 0.22 + randomBetween(-8, 8)}px`,
            rotation25: `${rotation * 0.24}deg`,
            fall50: `${fallDistance * 0.48}px`,
            drift50: `${driftDistance * 0.48 + randomBetween(-10, 10)}px`,
            rotation50: `${rotation * 0.49}deg`,
            fall75: `${fallDistance * 0.73}px`,
            drift75: `${driftDistance * 0.74 + randomBetween(-8, 8)}px`,
            rotation75: `${rotation * 0.74}deg`,
            duration: `${duration}ms`,
            delay: `${randomBetween(0, 180)}ms`,
         };
      });

      setFallingLeaves((currentLeaves) => [...currentLeaves.slice(-12), ...nextLeaves]);

      cooldownTimer.current = setTimeout(() => {
         isTreeCoolingDown.current = false;
      }, 700);
   }

   function removeLeaf(id) {
      setFallingLeaves((currentLeaves) => currentLeaves.filter((leaf) => leaf.id !== id));
   }

   return (
      <Box ref={innerRef} component={'main'} id={'home'} className={Style.homeScene}>
         <audio ref={treeAudioRef} src={leafRustleSound} preload="auto" />
         <div className={`${Style.homeStage} ${isHomeExiting ? Style.homeStageExiting : ''}`}>
            <img className={Style.background} src={homeBackground} alt={''} aria-hidden={'true'} />
            <button
               type={'button'}
               className={Style.treeLayer}
               onClick={handleTreeClick}
               aria-label={'轻摇树枝'}
            >
               <span
                  className={`${Style.treeMotion} ${isTreeShaking ? Style.treeShaking : ''}`}
                  onAnimationEnd={() => setIsTreeShaking(false)}
               >
                  <img className={Style.treeImage} src={homeTree} alt={''} />
               </span>
            </button>
            <div className={Style.fallingLeavesLayer} aria-hidden={'true'}>
               {fallingLeaves.map((leaf) => (
                  <img
                     key={leaf.id}
                     className={Style.fallingLeaf}
                     src={leaf.src}
                     alt={''}
                     aria-hidden={'true'}
                     onAnimationEnd={(event) => {
                        if (event.animationName.includes('leafFall')) {
                           removeLeaf(leaf.id);
                        }
                     }}
                     style={{
                        '--leaf-left': leaf.left,
                        '--leaf-top': leaf.top,
                        '--leaf-size': leaf.size,
                        '--leaf-fall': leaf.fallDistance,
                        '--leaf-drift': leaf.driftDistance,
                        '--leaf-rotation': leaf.rotation,
                        '--leaf-fall-25': leaf.fall25,
                        '--leaf-drift-25': leaf.drift25,
                        '--leaf-rotation-25': leaf.rotation25,
                        '--leaf-fall-50': leaf.fall50,
                        '--leaf-drift-50': leaf.drift50,
                        '--leaf-rotation-50': leaf.rotation50,
                        '--leaf-fall-75': leaf.fall75,
                        '--leaf-drift-75': leaf.drift75,
                        '--leaf-rotation-75': leaf.rotation75,
                        '--leaf-duration': leaf.duration,
                        '--leaf-delay': leaf.delay,
                     }}
                  />
               ))}
            </div>
            <div className={Style.smokeLayer} aria-hidden={'true'}>
               {[0, 1, 2].map((smokeIndex) => (
                  <img
                     key={smokeIndex}
                     className={Style.smoke}
                     src={homeSmoke}
                     alt={''}
                  />
               ))}
            </div>
            <button
               type={'button'}
               className={`${Style.houseLayer} ${isHomeExiting ? Style.houseLayerEntering : ''}`}
               onClick={handleEnterStudio}
               aria-label={'进入作品工作室'}
               disabled={isHomeExiting}
            >
               <img className={Style.houseImage} src={homeHouse} alt={''} />
            </button>
            <Link
               className={Style.houseHint}
               to={'/portfolio'}
               aria-label={"Enter Joyce's works studio"}
               onClick={handleEnterStudio}
            >
               Click the house to enter my studio
            </Link>
            <div className={Style.catTailLayer} aria-hidden={'true'}>
               <span className={Style.catTailMotion}>
                  <img className={Style.catTailImage} src={homeCatTail} alt={''} />
               </span>
            </div>
         </div>
         <div className={`${Style.heroContent} ${isHomeExiting ? Style.heroExiting : ''}`}>
            <h1 className={Style.heroTitle}>Hi, I'm Joyce</h1>
            <p className={Style.metadata}>03｜27届｜INFP｜网络与新媒体专业</p>
            <p className={Style.disciplines}>Product × AI × Content × Film</p>
            <p className={Style.introduction}>把想法变成可以被看见、使用和体验的东西。</p>
         </div>
      </Box>
   );
}
