import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import Style from './About.module.scss';
import folderClosed from '../../assets/about/folder-closed.png';
import folderOpen from '../../assets/about/folder-open.png';
import photo from '../../assets/about/photo.png';
import capabilityTicket from '../../assets/about/capability-ticket-optimized.png';
import thingsILike from '../../assets/about/things-i-like-optimized.png';
import quotePaper from '../../assets/about/quote-paper.png';
import internship from '../../assets/about/internship.png';
import welcomeTag from '../../assets/about/welcome-tag-optimized.png';
import contactMailbox from '../../assets/about/contact-mailbox.png';
import aboutLamp from '../../assets/about/about-lamp.png';
import aboutSwitchLamp from '../../assets/about/about-switch-lamp.png';
import aboutLightOverlay from '../../assets/about/about-light-overlay.png';
import pullSwitchSound from '../../assets/sounds/pull-switch.mp3';

const INITIAL_POSITIONS = {
    photo: {top: 14, left: -4.5},
    'capability-ticket': {top: 18.1, left: 12.7},
    'things-i-like': {top: 29.8, left: 28},
    'quote-paper': {top: 72.9, left: 18.7},
    internship: {top: 16.2, left: 56.2},
    'welcome-tag': {top: 54.8, left: 52.5},
};

const INTERACTIVE_ITEMS = [
    {name: 'photo', className: Style.photo, src: photo, alt: 'Joyce photo film strip', width: 29.1},
    {name: 'capability-ticket', className: Style.capabilityTicket, src: capabilityTicket, alt: 'Joyce capability ticket', width: 16.5},
    {name: 'things-i-like', className: Style.thingsILike, src: thingsILike, alt: 'Things Joyce likes', width: 16.1},
    {name: 'quote-paper', className: Style.quotePaper, src: quotePaper, alt: 'A quote Joyce likes', width: 28.4},
    {name: 'internship', className: Style.internship, src: internship, alt: 'Joyce internship experience', width: 36.8},
    {name: 'welcome-tag', className: Style.welcomeTag, src: welcomeTag, alt: 'Welcome to Joyce’s world', width: 16.3},
];

const clamp = (value, minimum, maximum) => Math.min(Math.max(value, minimum), maximum);

export default function About({innerRef}) {
    const navigate = useNavigate();
    const [aboutState, setAboutState] = useState('closed');
    const [focusedItem, setFocusedItem] = useState(null);
    const [positions, setPositions] = useState(INITIAL_POSITIONS);
    const [stackOrder, setStackOrder] = useState({});
    const [draggedItem, setDraggedItem] = useState(null);
    const [isLightOn, setIsLightOn] = useState(true);
    const [isSwitchAnimating, setIsSwitchAnimating] = useState(false);
    const [isContactMailboxPressed, setIsContactMailboxPressed] = useState(false);
    const stageRef = useRef(null);
    const scaleFrameRef = useRef(null);
    const pointerActionRef = useRef(null);
    const switchToggleTimerRef = useRef(null);
    const nextStackOrderRef = useRef(40);
    const switchAudioRef = useRef(null);
    const contactMailboxPressTimerRef = useRef(null);

    useLayoutEffect(() => {
        const scaleFrame = scaleFrameRef.current;
        if (!scaleFrame) return undefined;

        const updateScale = () => {
            scaleFrame.style.setProperty('--about-canvas-scale', `${scaleFrame.clientWidth / 1672}`);
        };

        updateScale();
        const resizeObserver = new ResizeObserver(updateScale);
        resizeObserver.observe(scaleFrame);

        return () => resizeObserver.disconnect();
    }, []);

    function handleOpenAbout() {
        // Future sequence: closed -> opening video -> open.
        setAboutState('open');
    }

    function handlePointerDown(event, item) {
        if (!stageRef.current || event.button !== 0) return;

        event.preventDefault();
        const stageRect = stageRef.current.getBoundingClientRect();
        pointerActionRef.current = {
            name: item.name,
            pointerId: event.pointerId,
            startX: event.clientX,
            startY: event.clientY,
            stageWidth: stageRect.width,
            stageHeight: stageRect.height,
            initial: {...positions[item.name]},
            width: item.width,
            hasDragged: false,
        };

        nextStackOrderRef.current += 1;
        setStackOrder((current) => ({...current, [item.name]: nextStackOrderRef.current}));
        setDraggedItem(item.name);
        event.currentTarget.setPointerCapture(event.pointerId);
    }

    function handlePointerMove(event) {
        const action = pointerActionRef.current;
        if (!action || action.pointerId !== event.pointerId) return;

        const deltaPixelsX = event.clientX - action.startX;
        const deltaPixelsY = event.clientY - action.startY;
        if (Math.hypot(deltaPixelsX, deltaPixelsY) > 5) action.hasDragged = true;
        if (!action.hasDragged) return;

        event.preventDefault();
        const deltaX = (deltaPixelsX / action.stageWidth) * 100;
        const deltaY = (deltaPixelsY / action.stageHeight) * 100;
        setPositions((current) => ({
            ...current,
            [action.name]: {
                left: clamp(action.initial.left + deltaX, -15, 115 - action.width),
                top: clamp(action.initial.top + deltaY, 0, 100),
            },
        }));
    }

    function finishPointerAction(event, item, wasCancelled = false) {
        const action = pointerActionRef.current;
        if (!action || action.pointerId !== event.pointerId) return;

        if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
            event.currentTarget.releasePointerCapture(event.pointerId);
        }
        pointerActionRef.current = null;
        setDraggedItem(null);

        if (!wasCancelled && !action.hasDragged) setFocusedItem(item);
    }

    function handleSwitchClick() {
        if (isSwitchAnimating) return;

        const switchAudio = switchAudioRef.current;
        if (switchAudio) {
            switchAudio.currentTime = 0;
            switchAudio.volume = 0.32;
            switchAudio.play().catch(() => {});
        }

        setIsSwitchAnimating(true);
        switchToggleTimerRef.current = window.setTimeout(() => {
            setIsLightOn((current) => !current);
            switchToggleTimerRef.current = null;
        }, 200);
    }

    function handleContactMailboxClick() {
        if (isContactMailboxPressed) return;

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            navigate('/contact');
            return;
        }

        setIsContactMailboxPressed(true);
        contactMailboxPressTimerRef.current = window.setTimeout(() => {
            navigate('/contact');
        }, 130);
    }

    useEffect(() => () => {
        if (switchToggleTimerRef.current) window.clearTimeout(switchToggleTimerRef.current);
        if (contactMailboxPressTimerRef.current) window.clearTimeout(contactMailboxPressTimerRef.current);
        if (switchAudioRef.current) {
            switchAudioRef.current.pause();
            switchAudioRef.current.currentTime = 0;
        }
    }, []);

    useEffect(() => {
        if (!focusedItem) return undefined;

        const handleKeyDown = (event) => {
            if (event.key === 'Escape') setFocusedItem(null);
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [focusedItem]);

    return (
        <main
            ref={innerRef}
            className={`${Style.aboutScene} ${isLightOn ? '' : Style.lightOff}`}
            id="about"
        >
            <audio ref={switchAudioRef} src={pullSwitchSound} preload="auto" />
            <div ref={scaleFrameRef} className={Style.aboutScaleFrame}>
              <div className={Style.aboutCanvas}>
                <div className={Style.aboutEnvironment}>
                    <div className={Style.aboutEnvironmentStage}>
                        <img className={Style.aboutLightOverlay} src={aboutLightOverlay} alt="" />
                        <img className={`${Style.aboutLightObject} ${Style.aboutLamp}`} src={aboutLamp} alt="" />
                        <button
                            type="button"
                            className={`${Style.aboutSwitchLamp} ${isSwitchAnimating ? Style.switchAnimating : ''}`}
                            aria-label="Toggle the lamp"
                            aria-pressed={!isLightOn}
                            aria-disabled={isSwitchAnimating}
                            onClick={handleSwitchClick}
                            onAnimationEnd={() => setIsSwitchAnimating(false)}
                        >
                            <img src={aboutSwitchLamp} alt="" draggable="false" />
                        </button>
                    </div>
                </div>
                {aboutState === 'closed' ? (
                    <div className={Style.folderArea}>
                        <button
                            type="button"
                            className={Style.folderButton}
                            onClick={handleOpenAbout}
                            aria-label="Open Joyce's profile folder"
                        >
                            <img
                                className={Style.folderClosed}
                                src={folderClosed}
                                alt="Joyce's closed profile folder"
                            />
                        </button>
                    </div>
                ) : (
                    <div className={Style.aboutOpenArea}>
                        <div ref={stageRef} className={Style.aboutOpenStage}>
                            <img className={Style.folderOpen} src={folderOpen} alt="Joyce's open profile folder" />
                            <span className={Style.lampGlow} aria-hidden="true" />

                        {INTERACTIVE_ITEMS.map((item) => (
                            <button
                                type="button"
                                className={`${Style.assetLayer} ${Style.interactiveAsset} ${item.className} ${draggedItem === item.name ? Style.draggingAsset : ''}`}
                                style={{
                                    top: `${positions[item.name].top}%`,
                                    left: `${positions[item.name].left}%`,
                                    zIndex: stackOrder[item.name],
                                }}
                                key={item.name}
                                onPointerDown={(event) => handlePointerDown(event, item)}
                                onPointerMove={handlePointerMove}
                                onPointerUp={(event) => finishPointerAction(event, item)}
                                onPointerCancel={(event) => finishPointerAction(event, item, true)}
                                onClick={(event) => {
                                    if (event.detail === 0) setFocusedItem(item);
                                }}
                                aria-label={`Focus ${item.name}`}
                            >
                                <span className={Style.paperMotion}>
                                    <img src={item.src} alt={item.alt} />
                                </span>
                            </button>
                        ))}

                        <button
                            type="button"
                            className={`${Style.contactMailbox} ${isContactMailboxPressed ? Style.contactMailboxPressed : ''}`}
                            onClick={handleContactMailboxClick}
                            aria-disabled={isContactMailboxPressed}
                            aria-label="Go to Contact"
                        >
                            <span className={Style.contactMailboxMotion}>
                                <img src={contactMailbox} alt="" />
                            </span>
                            <span className={Style.contactMailboxHint}>
                                CONTACT<span className={Style.contactMailboxHintArrow}>↗</span>
                            </span>
                        </button>

                        </div>
                    </div>
                )}
              </div>
            </div>

            {focusedItem && (
                <div
                    className={Style.lightbox}
                    role="dialog"
                    aria-modal="true"
                    aria-label={`${focusedItem.name} focused view`}
                    onClick={() => setFocusedItem(null)}
                >
                    <img
                        className={`${Style.lightboxImage} ${focusedItem.name === 'quote-paper' ? Style.focusedQuote : ''}`}
                        src={focusedItem.src}
                        alt={focusedItem.alt}
                        onClick={(event) => event.stopPropagation()}
                    />
                </div>
            )}


        </main>
    );
}
