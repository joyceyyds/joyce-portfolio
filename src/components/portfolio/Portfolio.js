import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import {Box} from "@mui/material";
import {useNavigate} from 'react-router-dom';
import Style from './Portfolio.module.scss';
import ProductNotebook from './ProductNotebook';
import ContentBooks from './ContentBooks';
import FilmOverlay from './film/FilmOverlay';
import AIOverlay from './ai/AIOverlay';
import {
    worksDay,
    worksNight,
    contentBooks,
    productNotebook,
    aiComputer,
    filmCamera,
    aboutFolder,
    deskLamp,
    lampSwitch,
    turntableBase,
    turntableVinyl,
    turntableTonearm,
    photoFrame,
    photoFrameOpen,
    waffle,
    icedCoffee,
} from './worksSceneAssets';
import sunflowerMusic from '../../assets/sounds/Sunflower.mp3';
import deskLampSwitchSound from '../../assets/sounds/desk-lamp-switch.mp3';
import recordPlayerClickSound from '../../assets/sounds/record-player-click.mp3';
import {
    preloadModulesInIdle,
    preloadVisualModuleWithTimeout,
    wait,
} from '../../utils/preloadImages';
import {IDLE_PRELOAD_ORDER} from '../../utils/visualAssetManifest';

const STAR_POINTS = [
    {left: '12%', top: '24%', size: '0.34%', duration: '1.8s', delay: '-1.1s', opacity: 0.94},
    {left: '25%', top: '58%', size: '0.25%', duration: '2.4s', delay: '-1.7s', opacity: 0.82},
    {left: '36%', top: '32%', size: '0.39%', duration: '3.1s', delay: '-2.3s', opacity: 0.98},
    {left: '48%', top: '70%', size: '0.28%', duration: '2.1s', delay: '-0.6s', opacity: 0.86},
    {left: '57%', top: '18%', size: '0.23%', duration: '3.5s', delay: '-0.8s', opacity: 0.78},
    {left: '66%', top: '48%', size: '0.36%', duration: '2.7s', delay: '-2.1s', opacity: 0.92},
    {left: '76%', top: '27%', size: '0.27%', duration: '3.3s', delay: '-1.2s', opacity: 0.84},
    {left: '84%', top: '62%', size: '0.41%', duration: '2s', delay: '-1.9s', opacity: 1},
    {left: '18%', top: '78%', size: '0.22%', duration: '2.9s', delay: '-0.2s', opacity: 0.76},
    {left: '43%', top: '13%', size: '0.31%', duration: '2.3s', delay: '-1.8s', opacity: 0.9},
    {left: '70%', top: '78%', size: '0.24%', duration: '3.4s', delay: '-2.6s', opacity: 0.8},
    {left: '91%', top: '36%', size: '0.3%', duration: '2.6s', delay: '-1.5s', opacity: 0.88},
];

const SCENE_PROPS = [
    {name: 'photo-frame', source: photoFrame, left: 21.59, top: 29, width: 7.3},
    {name: 'waffle', source: waffle, left: 61.96, top: 60.32, width: 8},
    {name: 'iced-coffee', source: icedCoffee, left: 68.02, top: 57.39, width: 6.6},
];

export default function Portfolio({innerRef}) {
    const navigate = useNavigate();
    const [isProductOpen, setIsProductOpen] = useState(false);
    const [isContentOpen, setIsContentOpen] = useState(false);
    const [isFilmOpen, setIsFilmOpen] = useState(false);
    const [isAIOpen, setIsAIOpen] = useState(false);
    const [selectedAIProject, setSelectedAIProject] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isTonearmEngaged, setIsTonearmEngaged] = useState(false);
    const [isTurntableLocked, setIsTurntableLocked] = useState(false);
    const [isLampOn, setIsLampOn] = useState(false);
    const [isAboutFolderPressed, setIsAboutFolderPressed] = useState(false);
    const [isPhotoFrameOpen, setIsPhotoFrameOpen] = useState(false);
    const [isSceneReady, setIsSceneReady] = useState(false);
    const lampAudioRef = useRef(null);
    const musicAudioRef = useRef(null);
    const turntableClickAudioRef = useRef(null);
    const pendingTurntableStartRef = useRef(false);
    const turntablePlayTimerRef = useRef(null);
    const turntableUnlockTimerRef = useRef(null);
    const pendingModuleRef = useRef(new Set());
    const scaleFrameRef = useRef(null);

    useLayoutEffect(() => {
        const scaleFrame = scaleFrameRef.current;
        if (!scaleFrame) return undefined;

        const updateScale = () => {
            scaleFrame.style.setProperty('--works-canvas-scale', `${scaleFrame.clientWidth / 1672}`);
        };

        updateScale();
        const resizeObserver = new ResizeObserver(updateScale);
        resizeObserver.observe(scaleFrame);
        return () => resizeObserver.disconnect();
    }, []);

    function closeAI() {
        setIsAIOpen(false);
        setSelectedAIProject(null);
    }

    function openModule(moduleName, open) {
        if (pendingModuleRef.current.has(moduleName)) return;
        pendingModuleRef.current.add(moduleName);
        preloadVisualModuleWithTimeout(moduleName, 1500).then(() => {
            pendingModuleRef.current.delete(moduleName);
            open();
        });
    }

    function handleLampClick() {
        const lampAudio = lampAudioRef.current;
        if (lampAudio) {
            lampAudio.currentTime = 0;
            lampAudio.volume = 0.32;
            lampAudio.play().catch(() => {});
        }
        setIsLampOn((currentState) => !currentState);
    }

    function handleTurntableClick() {
        const clickAudio = turntableClickAudioRef.current;
        const audio = musicAudioRef.current;
        const hasPendingStart = pendingTurntableStartRef.current;

        if (turntablePlayTimerRef.current) {
            window.clearTimeout(turntablePlayTimerRef.current);
            turntablePlayTimerRef.current = null;
        }
        pendingTurntableStartRef.current = false;

        if (clickAudio) {
            if (!clickAudio.getAttribute('src')) {
                clickAudio.src = recordPlayerClickSound;
                clickAudio.load();
            }
            clickAudio.volume = 0.35;
            clickAudio.currentTime = 0;
        }

        if (isTurntableLocked && !hasPendingStart) {
            clickAudio?.play().catch(() => {});
            return;
        }

        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const lockDelay = reducedMotion ? 50 : 450;

        if (turntableUnlockTimerRef.current) {
            window.clearTimeout(turntableUnlockTimerRef.current);
        }
        setIsTurntableLocked(true);

        if (isPlaying || hasPendingStart) {
            audio?.pause();
            setIsPlaying(false);
            setIsTonearmEngaged(false);
            clickAudio?.play().catch(() => {});
        } else {
            if (audio) {
                audio.volume = 0.2;
                if (!audio.getAttribute('src')) {
                    audio.src = sunflowerMusic;
                    audio.load();
                }
            }

            setIsTonearmEngaged(true);
            pendingTurntableStartRef.current = true;
            clickAudio?.play().catch(() => {});
            turntablePlayTimerRef.current = window.setTimeout(() => {
                turntablePlayTimerRef.current = null;
                if (!pendingTurntableStartRef.current) return;
                pendingTurntableStartRef.current = false;
                if (!audio) {
                    setIsTonearmEngaged(false);
                    return;
                }
                audio.play()
                    .then(() => setIsPlaying(true))
                    .catch(() => {
                        setIsPlaying(false);
                        setIsTonearmEngaged(false);
                    });
            }, 700);
        }

        turntableUnlockTimerRef.current = window.setTimeout(() => {
            setIsTurntableLocked(false);
        }, lockDelay);
    }

    async function handleAboutFolderClick() {
        if (isAboutFolderPressed) return;

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            await preloadVisualModuleWithTimeout('aboutScene', 1500);
            navigate('/about');
            return;
        }

        setIsAboutFolderPressed(true);
        await Promise.all([
            preloadVisualModuleWithTimeout('aboutScene', 1500),
            wait(130),
        ]);
        navigate('/about');
    }

    useEffect(() => () => {
        musicAudioRef.current?.pause();
        if (turntableClickAudioRef.current) {
            turntableClickAudioRef.current.pause();
            turntableClickAudioRef.current.currentTime = 0;
        }
        pendingTurntableStartRef.current = false;
        if (turntablePlayTimerRef.current) {
            window.clearTimeout(turntablePlayTimerRef.current);
        }
        if (turntableUnlockTimerRef.current) {
            window.clearTimeout(turntableUnlockTimerRef.current);
        }
    }, []);

    useEffect(() => {
        if (!isPhotoFrameOpen) return undefined;

        const handleKeyDown = (event) => {
            if (event.key === 'Escape') setIsPhotoFrameOpen(false);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isPhotoFrameOpen]);

    useEffect(() => {
        let isMounted = true;
        preloadVisualModuleWithTimeout('works', 4500).then(() => {
            if (isMounted) setIsSceneReady(true);
        });
        return () => {
            isMounted = false;
        };
    }, []);

    useEffect(() => {
        if (!isSceneReady) return;
        preloadModulesInIdle(IDLE_PRELOAD_ORDER);
    }, [isSceneReady]);

    return (
        <Box
            id={'portfolio'}
            ref={innerRef}
            component={'main'}
            className={Style.scene}
        >
            <Box ref={scaleFrameRef} className={`${Style.stageFrame} ${isSceneReady ? Style.stageFrameReady : ''}`}>
              <Box className={Style.stage} aria-label={'WORKS desk scene'}>
                <span
                    className={`${Style.sceneBackground} ${isLampOn ? '' : Style.sceneBackgroundVisible}`}
                    style={{backgroundImage: `url(${worksDay})`}}
                    aria-hidden={'true'}
                />
                <span
                    className={`${Style.sceneBackground} ${isLampOn ? Style.sceneBackgroundVisible : ''}`}
                    style={{backgroundImage: `url(${worksNight})`}}
                    aria-hidden={'true'}
                />
                <div className={Style.stageForeground}>
                {SCENE_PROPS.map(({name, source, left, top, width}) => {
                    const style = {left: `${left}%`, top: `${top}%`, width: `${width}%`};
                    if (name === 'photo-frame') {
                        return (
                            <button
                                key={name}
                                type={'button'}
                                className={`${Style.sceneProp} ${Style.photoFrameTrigger}`}
                                style={style}
                                aria-label={'Open photo'}
                                onClick={() => openModule('photoFrameOpen', () => setIsPhotoFrameOpen(true))}
                            >
                                <img className={Style.scenePropImage} src={source} alt={''} draggable={false} />
                            </button>
                        );
                    }
                    return (
                        <img
                            key={name}
                            className={Style.sceneProp}
                            src={source}
                            alt={''}
                            aria-hidden={'true'}
                            draggable={false}
                            style={style}
                        />
                    );
                })}
                <div className={Style.skylightEffects} aria-hidden={'true'}>
                    <div className={`${Style.starLayer} ${isLampOn ? Style.skyEffectVisible : ''}`}>
                        {STAR_POINTS.map((star, index) => (
                            <span
                                key={index}
                                className={Style.star}
                                style={{
                                    '--star-left': star.left,
                                    '--star-top': star.top,
                                    '--star-size': star.size,
                                    '--twinkle-duration': star.duration,
                                    '--twinkle-delay': star.delay,
                                    '--star-opacity': star.opacity,
                                }}
                            />
                        ))}
                    </div>
                </div>
                <button
                    type={'button'}
                    className={Style.turntable}
                    onClick={handleTurntableClick}
                    aria-disabled={isTurntableLocked}
                    aria-label={isPlaying ? 'Pause background music' : 'Play background music'}
                    aria-pressed={isPlaying}
                >
                    <img className={Style.turntableBase} src={turntableBase} alt={''} />
                    <div className={Style.vinylPosition}>
                        <div className={Style.vinylSpin}>
                            <img className={Style.turntableVinyl} src={turntableVinyl} alt={''} />
                        </div>
                    </div>
                    <img
                        className={`${Style.turntableTonearm} ${isTonearmEngaged ? Style.tonearmPlaying : Style.tonearmIdle}`}
                        src={turntableTonearm}
                        alt={''}
                    />
                    <span className={Style.turntableHint} aria-hidden={'true'}>
                        {isPlaying ? 'PAUSE MUSIC Ⅱ' : 'PLAY MUSIC ♪'}
                    </span>
                </button>
                <div className={Style.books}>
                    <button
                        type={'button'}
                        className={Style.booksHitArea}
                        aria-label={'内容 / CONTENT'}
                        onClick={() => openModule('content', () => setIsContentOpen(true))}
                    />
                    <img className={`${Style.entryImage} ${Style.booksImage}`} src={contentBooks} alt={''} />
                    <span className={Style.entryLabel}>
                        <span className={Style.labelEnglish}>CONTENT</span>
                        <span className={Style.labelChinese}>内容</span>
                    </span>
                </div>
                <div className={`${Style.lampWrapper} ${Style.lamp}`}>
                    <img className={Style.lampImage} src={deskLamp} alt={'Desk lamp'} />
                    <button
                        type={'button'}
                        className={Style.lampSwitch}
                        onClick={handleLampClick}
                        aria-label={isLampOn ? 'Turn lamp off' : 'Turn lamp on'}
                        aria-pressed={isLampOn}
                    >
                        <img src={lampSwitch} alt={''} />
                    </button>
                </div>
                <button
                    type={'button'}
                    className={`${Style.entry} ${Style.computer}`}
                    aria-label={'人工智能 / AI'}
                    onClick={() => openModule('ai', () => setIsAIOpen(true))}
                >
                    <img className={Style.entryImage} src={aiComputer} alt={''} />
                    <span className={Style.entryLabel}>
                        <span className={Style.labelEnglish}>AI</span>
                        <span className={Style.labelChinese}>人工智能</span>
                    </span>
                </button>
                <button type={'button'} className={`${Style.entry} ${Style.notebook}`} aria-label={'产品 / PRODUCT'} onClick={() => openModule('product', () => setIsProductOpen(true))}>
                    <img className={Style.entryImage} src={productNotebook} alt={''} />
                    <span className={Style.entryLabel}>
                        <span className={Style.labelEnglish}>PRODUCT</span>
                        <span className={Style.labelChinese}>产品</span>
                    </span>
                </button>
                <button type={'button'} className={`${Style.entry} ${Style.camera}`} aria-label={'影像 / FILM'} onClick={() => openModule('film', () => setIsFilmOpen(true))}>
                    <img className={Style.entryImage} src={filmCamera} alt={''} />
                    <span className={Style.entryLabel}>
                        <span className={Style.labelEnglish}>FILM</span>
                        <span className={Style.labelChinese}>影像</span>
                    </span>
                </button>
                <button
                    type={'button'}
                    className={`${Style.aboutFolder} ${isAboutFolderPressed ? Style.aboutFolderPressed : ''}`}
                    aria-label={'关于 / ABOUT'}
                    aria-disabled={isAboutFolderPressed}
                    onClick={handleAboutFolderClick}
                >
                    <span className={Style.aboutFolderMotion}>
                        <img src={aboutFolder} alt={''} />
                    </span>
                    <span className={Style.aboutFolderHint} aria-hidden={'true'}>
                        ABOUT ↗
                    </span>
                </button>
                </div>
              </Box>
            </Box>
            {isPhotoFrameOpen && (
                <div
                    className={Style.photoOverlay}
                    role={'presentation'}
                    onClick={() => setIsPhotoFrameOpen(false)}
                >
                    <img
                        className={Style.photoExpanded}
                        src={photoFrameOpen}
                        alt={'Joyce in a red hat outdoors'}
                        onClick={(event) => event.stopPropagation()}
                    />
                </div>
            )}
            <audio ref={musicAudioRef} preload="none" loop />
            <audio ref={turntableClickAudioRef} preload="none" />
            <audio ref={lampAudioRef} src={deskLampSwitchSound} preload="auto" />
            <ProductNotebook isOpen={isProductOpen} onClose={() => setIsProductOpen(false)} />
            <ContentBooks isOpen={isContentOpen} onClose={() => setIsContentOpen(false)} />
            <FilmOverlay isOpen={isFilmOpen} onClose={() => setIsFilmOpen(false)} />
            <AIOverlay
                isOpen={isAIOpen}
                selectedProject={selectedAIProject}
                onSelect={setSelectedAIProject}
                onClose={closeAI}
            />
        </Box>
    );
};
