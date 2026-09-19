import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import DepthCarousel from './DepthCarousel';
import Style from './FilmOverlay.module.scss';
import yuwang from '../../../assets/works/film/yuwang.webp';
import mujianMuji from '../../../assets/works/film/mujian-muji.webp';
import dragonSeeker from '../../../assets/works/film/dragon-seeker.webp';
import workInProgress from '../../../assets/works/film/work-in-progress.webp';

const filmItems = [
    {id: 'yuwang', image: yuwang, alt: '狱望', title: '《狱望》', meta: 'DIRECTOR · 2023.12', playable: true, video: `${process.env.PUBLIC_URL}/videos/yuwang.mp4`},
    {id: 'mujian-muji', image: mujianMuji, alt: '遇见木屐', title: '《遇见木屐》', meta: 'DIRECTOR & EDITOR · 2025.07', playable: true, video: `${process.env.PUBLIC_URL}/videos/mujian-muji.mp4`},
    {id: 'dragon-seeker', image: dragonSeeker, alt: '寻龙者·亡国之誓', title: '《寻龙者·亡国之誓》', meta: 'AIGC & EDITING · 2025.04', playable: true, video: `${process.env.PUBLIC_URL}/videos/dragon-seeker.mp4`},
    {id: 'work-in-progress', image: workInProgress, alt: '正在创作中', title: '正在创作中…', meta: 'WORK IN PROGRESS', playable: false},
];

export default function FilmOverlay({isOpen, onClose}) {
    const [activeFilm, setActiveFilm] = useState(filmItems[0]);
    const [playingFilm, setPlayingFilm] = useState(null);
    const videoRef = useRef(null);
    const visualGroupRef = useRef(null);

    useLayoutEffect(() => {
        const visualGroup = visualGroupRef.current;
        if (!isOpen || playingFilm || !visualGroup) return undefined;

        const updateCompositionScale = () => {
            const viewportWidth = window.visualViewport?.width || window.innerWidth;
            const viewportHeight = window.visualViewport?.height || window.innerHeight;
            const isMobilePortrait = viewportWidth <= 768 && viewportHeight >= viewportWidth;
            const isMobileLandscape = viewportWidth <= 960 && viewportHeight <= 500 && viewportWidth > viewportHeight;

            let scale = 1;
            if (isMobilePortrait || isMobileLandscape) {
                const targetWidth = viewportWidth * (isMobilePortrait ? 0.76 : 0.72);
                const targetHeight = viewportHeight * (isMobilePortrait ? 0.68 : 0.58);
                const widthScale = targetWidth / visualGroup.offsetWidth;
                const heightScale = targetHeight / visualGroup.offsetHeight;
                scale = Math.min(widthScale, heightScale, 1);
            }

            visualGroup.style.setProperty('--film-composition-scale', `${scale}`);
        };

        updateCompositionScale();
        const resizeObserver = new ResizeObserver(updateCompositionScale);
        resizeObserver.observe(visualGroup);
        window.addEventListener('resize', updateCompositionScale);
        window.visualViewport?.addEventListener('resize', updateCompositionScale);

        return () => {
            resizeObserver.disconnect();
            window.removeEventListener('resize', updateCompositionScale);
            window.visualViewport?.removeEventListener('resize', updateCompositionScale);
        };
    }, [isOpen, playingFilm]);

    function closePlayer() {
        if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
        }
        setPlayingFilm(null);
    }

    useEffect(() => {
        if (!isOpen) return undefined;
        const handleKeyDown = (event) => {
            if (event.key !== 'Escape') return;
            if (playingFilm) {
                closePlayer();
                return;
            }
            onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose, playingFilm]);

    useEffect(() => () => {
        if (videoRef.current) videoRef.current.pause();
    }, []);

    function handleFilmClick(item) {
        setPlayingFilm(item);
    }

    if (!isOpen) return null;

    return <div className={Style.overlay} onClick={(event) => {
        if (event.target !== event.currentTarget) return;
        if (playingFilm) {
            closePlayer();
            return;
        }
        onClose();
    }} role="presentation">
        <section
            className={`${Style.filmInterface} ${playingFilm ? Style.playerInterface : ''}`}
            onClick={(event) => {
                event.stopPropagation();
                if (playingFilm && event.target === event.currentTarget) closePlayer();
            }}
            aria-label="Selected films"
        >
            {playingFilm ? (
                <div className={Style.videoFrame} onClick={(event) => event.stopPropagation()}>
                    <video
                        ref={videoRef}
                        className={Style.video}
                        src={playingFilm.video}
                        controls
                        playsInline
                        preload="metadata"
                    />
                </div>
            ) : <div ref={visualGroupRef} className={Style.visualGroup}>
                <div className={Style.carouselFrame}>
                    <DepthCarousel
                        items={filmItems}
                        cardWidth={230}
                        cardHeight={345}
                        radius={4}
                        depth={220}
                        spread={90}
                        tilt={22}
                        tiltDirection="right"
                        perspective={1400}
                        visibleCards={4}
                        falloff={0.2}
                        blur={6}
                        autoplay={false}
                        loop
                        showControls
                        showIndicators
                        onChange={(index, item) => setActiveFilm(item)}
                        onActiveClick={(item) => {
                            if (item.playable) handleFilmClick(item);
                        }}
                    />
                </div>
                <div className={Style.filmInfo} aria-live="polite">
                    <strong>{activeFilm.title}</strong>
                    <span>{activeFilm.meta}</span>
                </div>
            </div>}
        </section>
    </div>;
}
