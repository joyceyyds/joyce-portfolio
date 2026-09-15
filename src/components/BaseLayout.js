import React, { useEffect, useRef, useState } from 'react';
import Style from './BaseLayout.module.scss'
import Navbar from "./Navbar";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Grid } from "@mui/material";
import MultiPageRoutes from './MultiPageRoutes';
import StudioLoader from './transition/StudioLoader';
import coffeeMachineSound from '../assets/sounds/coffee-machine.mp3';

export default function BaseLayout() {
   const location = useLocation()
   const navigate = useNavigate()

   const [active, setActive] = useState(location.pathname === '/' ? 'home' : location.pathname.slice(1, location.pathname.length));
   let [darkMode, setDarkMode] = useState(false);
   const [studioLoader, setStudioLoader] = useState({visible: false, reducedMotion: false, isExiting: false});
   const isStudioTransitioning = useRef(false);
   const loaderDisplayTimer = useRef(null);
   const loaderPaintTimer = useRef(null);
   const loaderRemovalTimer = useRef(null);
   const coffeeAudioRef = useRef(null);
   useEffect(() => {
      let detectedDarkMode = JSON.parse(localStorage.getItem('darkMode'));

      if (detectedDarkMode) {
         setDarkMode(detectedDarkMode)
      } else {
         localStorage.setItem('darkMode', 'false')
      }
   }, [])

   useEffect(() => {
      setActive(location.pathname === '/' ? 'home' : location.pathname.slice(1));
   }, [location.pathname]);

   useEffect(() => () => {
      clearTimeout(loaderDisplayTimer.current);
      clearTimeout(loaderPaintTimer.current);
      clearTimeout(loaderRemovalTimer.current);
      if (coffeeAudioRef.current) {
         coffeeAudioRef.current.pause();
         coffeeAudioRef.current.currentTime = 0;
      }
   }, []);

   function enterStudio() {
      if (isStudioTransitioning.current) {
         return;
      }

      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const displayDuration = reducedMotion ? 650 : 2300;
      const paintDelay = reducedMotion ? 0 : 75;
      const fadeDuration = reducedMotion ? 100 : 300;

      isStudioTransitioning.current = true;
      setStudioLoader({visible: true, reducedMotion, isExiting: false});

      const coffeeAudio = coffeeAudioRef.current;
      if (coffeeAudio) {
         coffeeAudio.currentTime = 0;
         coffeeAudio.volume = 0.30;
         coffeeAudio.play().catch(() => {});
      }

      loaderDisplayTimer.current = setTimeout(() => {
         if (coffeeAudioRef.current) {
            coffeeAudioRef.current.pause();
            coffeeAudioRef.current.currentTime = 0;
         }
         window.scrollTo(0, 0);
         navigate('/portfolio');

         loaderPaintTimer.current = setTimeout(() => {
            setStudioLoader((currentState) => ({...currentState, isExiting: true}));
            loaderRemovalTimer.current = setTimeout(() => {
               setStudioLoader({visible: false, reducedMotion: false, isExiting: false});
               isStudioTransitioning.current = false;
            }, fadeDuration);
         }, paintDelay);
      }, displayDuration);
   }

   return (
      <Box className={darkMode ? Style.dark : Style.light}>
         <Grid container display={'flex'} flexDirection={'column'} minHeight={'100vh'}
            justifyContent={'space-between'}>
            <Grid item>
               <Navbar active={active} setActive={setActive} />
            </Grid>
            <Grid item flexGrow={1}>
               <MultiPageRoutes onEnterStudio={enterStudio}/>
            </Grid>
         </Grid>
         {studioLoader.visible && (
            <StudioLoader
               reducedMotion={studioLoader.reducedMotion}
               isExiting={studioLoader.isExiting}
            />
         )}
         <audio ref={coffeeAudioRef} src={coffeeMachineSound} preload="auto" />
      </Box>
   )
}
