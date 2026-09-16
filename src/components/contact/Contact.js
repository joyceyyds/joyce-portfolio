import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import Style from './Contact.module.scss';
import contactBackground from '../../assets/contact/contact-background-new.webp';
import contactMailboxMain from '../../assets/contact/contact-mailbox-main.png';
import contactEnvelopeClosed from '../../assets/contact/contact-envelope-closed.png';
import contactEnvelopeOpenBack from '../../assets/contact/contact-envelope-open-back.png';
import contactEnvelopeOpenBase from '../../assets/contact/contact-envelope-open-base.png';
import contactEnvelopeOpenFront from '../../assets/contact/contact-envelope-open-front.png';
import contactLetter from '../../assets/contact/contact-letter.png';
import dandelion01 from '../../assets/contact/dandelion-01.png';
import dandelion02 from '../../assets/contact/dandelion-02.png';
import dandelion03 from '../../assets/contact/dandelion-03.png';
import dandelion04 from '../../assets/contact/dandelion-04.png';
import dandelion05 from '../../assets/contact/dandelion-05.png';

const DANDELIONS = [
    {asset: dandelion01, width: 0.78, opacity: 0.48, duration: 13.5, delay: 0.4, x: [-6, 12, 31, 58, 106], y: [76, 66, 69, 52, 36], rotate: [-14, 28, 10, 38, 55]},
    {asset: dandelion02, width: 1.12, opacity: 0.62, duration: 16.2, delay: 7.1, x: [-8, 9, 29, 63, 108], y: [58, 49, 53, 38, 22], rotate: [12, -8, 18, 3, -34]},
    {asset: dandelion03, width: 0.66, opacity: 0.35, duration: 10.4, delay: 3.8, x: [8, 24, 43, 69, 112], y: [84, 72, 75, 57, 44], rotate: [-20, 2, -12, 19, 42]},
    {asset: dandelion04, width: 1.5, opacity: 0.68, duration: 17.6, delay: 10.6, x: [-7, 14, 36, 67, 107], y: [42, 34, 39, 25, 12], rotate: [17, 37, 21, 54, 76]},
    {asset: dandelion05, width: 1.62, opacity: 0.42, duration: 14.8, delay: 5.3, x: [18, 34, 53, 78, 111], y: [72, 63, 67, 49, 35], rotate: [-8, -29, -11, -38, -57]},
    {asset: dandelion01, width: 0.92, opacity: 0.57, duration: 11.7, delay: 9.4, x: [-5, 16, 38, 72, 109], y: [91, 79, 82, 64, 49], rotate: [5, 24, 11, 36, 62]},
    {asset: dandelion03, width: 1.26, opacity: 0.31, duration: 18, delay: 1.9, x: [30, 45, 61, 84, 113], y: [54, 44, 48, 33, 19], rotate: [-18, -2, -25, -8, 22]},
    {asset: dandelion04, width: 0.72, opacity: 0.72, duration: 9.6, delay: 6.2, x: [-4, 19, 42, 76, 110], y: [67, 59, 62, 45, 31], rotate: [20, 43, 26, 58, 83]},
    {asset: dandelion02, width: 1.38, opacity: 0.39, duration: 15.4, delay: 11.8, x: [42, 54, 68, 89, 116], y: [86, 75, 79, 61, 47], rotate: [-4, -23, -9, -34, -51]},
    {asset: dandelion05, width: 0.84, opacity: 0.53, duration: 12.6, delay: 2.7, x: [-6, 11, 34, 65, 106], y: [34, 27, 31, 18, 8], rotate: [9, 29, 15, 41, 66]},
    {asset: dandelion01, width: 1.08, opacity: 0.29, duration: 17.1, delay: 8.3, x: [55, 66, 78, 95, 119], y: [61, 53, 57, 41, 28], rotate: [-16, 4, -10, 17, 38]},
    {asset: dandelion03, width: 0.6, opacity: 0.64, duration: 10.9, delay: 4.6, x: [4, 23, 46, 77, 111], y: [48, 39, 44, 28, 16], rotate: [14, -5, 11, -14, -38]},
];

const CONTACT_ENVELOPE_LAYOUT = {
    closed: {top: 29.0, left: 50.0, width: 16.6},
    back: {top: 15.4, left: 49.9, width: 26.8},
    base: {top: 28.3, left: 50.0, width: 18.2},
    front: {top: 24.8, left: 50.0, width: 20.8},
    letter: {top: 20.2, left: 49.8, width: 15.0},
};

const EXPANDED_LETTER_LAYOUT = {top: 10.0, left: 50.0, width: 27.0};
const LETTER_RISE_DURATION = 1000;

export default function Contact() {
    const [mailState, setMailState] = useState('idle');
    const scaleFrameRef = useRef(null);

    useLayoutEffect(() => {
        const scaleFrame = scaleFrameRef.current;
        if (!scaleFrame) return undefined;

        const updateScale = () => {
            scaleFrame.style.setProperty('--contact-canvas-scale', `${scaleFrame.clientWidth / 1662}`);
        };

        updateScale();
        const resizeObserver = new ResizeObserver(updateScale);
        resizeObserver.observe(scaleFrame);
        return () => resizeObserver.disconnect();
    }, []);

    useEffect(() => {
        if (mailState !== 'letterRising') return undefined;
        const timer = window.setTimeout(() => setMailState('letterReady'), LETTER_RISE_DURATION);
        return () => window.clearTimeout(timer);
    }, [mailState]);

    useEffect(() => {
        if (mailState !== 'expandedLetter') return undefined;
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') setMailState('letterReady');
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [mailState]);

    function closeMail() {
        setMailState('idle');
    }

    function handleSceneClick(event) {
        if (event.target !== event.currentTarget) return;
        if (['openEnvelope', 'letterRising', 'letterReady', 'expandedLetter'].includes(mailState)) {
            closeMail();
        }
    }

    function handleMailboxClick(event) {
        event.stopPropagation();
        if (mailState === 'idle') {
            setMailState('closedEnvelope');
            return;
        }
        closeMail();
    }

    function handleEnvelopeClick(event) {
        event.stopPropagation();
        if (mailState === 'closedEnvelope') setMailState('openEnvelope');
    }

    function handleOpenEnvelopeClick(event) {
        event.stopPropagation();
        if (mailState === 'openEnvelope') setMailState('letterRising');
    }

    function handleLetterClick(event) {
        event.stopPropagation();
        if (mailState === 'letterReady') setMailState('expandedLetter');
        if (mailState === 'expandedLetter') setMailState('letterReady');
    }

    function handleLetterKeyDown(event) {
        if ((event.key === 'Enter' || event.key === ' ') && (mailState === 'letterReady' || mailState === 'expandedLetter')) {
            event.preventDefault();
            handleLetterClick(event);
        }
    }

    function getLayoutStyle(layout) {
        return {
            top: `${layout.top}%`,
            left: `${layout.left}%`,
            width: `${layout.width}%`,
        };
    }

    return (
        <main className={Style.contactScene} onClick={handleSceneClick}>
          <div ref={scaleFrameRef} className={Style.contactScaleFrame}>
            <div className={Style.contactStage} aria-label="Contact mailbox scene" onClick={handleSceneClick}>
                <img className={Style.contactBackground} src={contactBackground} alt="" />
                <div className={Style.dandelionLayer} aria-hidden="true">
                    {DANDELIONS.map((dandelion, index) => (
                        <img
                            key={`${index}-${dandelion.duration}`}
                            className={Style.dandelion}
                            src={dandelion.asset}
                            alt=""
                            style={{
                                '--dandelion-width': `${dandelion.width}%`,
                                '--dandelion-opacity': dandelion.opacity,
                                '--dandelion-mid-opacity': (dandelion.opacity * 0.76).toFixed(3),
                                '--dandelion-duration': `${dandelion.duration}s`,
                                '--dandelion-delay': `${-dandelion.delay}s`,
                                '--x0': `${dandelion.x[0]}%`, '--y0': `${dandelion.y[0]}%`,
                                '--x1': `${dandelion.x[1]}%`, '--y1': `${dandelion.y[1]}%`,
                                '--x2': `${dandelion.x[2]}%`, '--y2': `${dandelion.y[2]}%`,
                                '--x3': `${dandelion.x[3]}%`, '--y3': `${dandelion.y[3]}%`,
                                '--x4': `${dandelion.x[4]}%`, '--y4': `${dandelion.y[4]}%`,
                                '--r0': `${dandelion.rotate[0]}deg`, '--r1': `${dandelion.rotate[1]}deg`,
                                '--r2': `${dandelion.rotate[2]}deg`, '--r3': `${dandelion.rotate[3]}deg`,
                                '--r4': `${dandelion.rotate[4]}deg`,
                            }}
                        />
                    ))}
                </div>
                {mailState !== 'idle' && (
                    <div className={`${Style.mailInteraction} ${Style[mailState]}`}>
                        <button
                            type="button"
                            className={Style.closedEnvelopeWrapper}
                            style={getLayoutStyle(CONTACT_ENVELOPE_LAYOUT.closed)}
                            onClick={handleEnvelopeClick}
                            aria-label="Open contact envelope"
                            aria-disabled={mailState !== 'closedEnvelope'}
                        >
                            <img className={Style.closedEnvelope} src={contactEnvelopeClosed} alt="" />
                        </button>

                        {['openEnvelope', 'letterRising', 'letterReady', 'expandedLetter'].includes(mailState) && (
                            <div className={Style.openEnvelopeScene} onClick={(event) => event.stopPropagation()}>
                                <img className={Style.envelopeBack} style={getLayoutStyle(CONTACT_ENVELOPE_LAYOUT.back)} src={contactEnvelopeOpenBack} alt="" onClick={(event) => event.stopPropagation()} />
                                <img className={Style.envelopeBase} style={getLayoutStyle(CONTACT_ENVELOPE_LAYOUT.base)} src={contactEnvelopeOpenBase} alt="" onClick={(event) => event.stopPropagation()} />
                                <div
                                    className={Style.letterWrapper}
                                    style={getLayoutStyle(mailState === 'expandedLetter' ? EXPANDED_LETTER_LAYOUT : CONTACT_ENVELOPE_LAYOUT.letter)}
                                    onClick={handleLetterClick}
                                    onKeyDown={handleLetterKeyDown}
                                    role="button"
                                    tabIndex={mailState === 'letterReady' || mailState === 'expandedLetter' ? 0 : -1}
                                    aria-label={mailState === 'expandedLetter' ? 'Collapse contact letter' : 'Expand contact letter'}
                                    aria-disabled={mailState !== 'letterReady' && mailState !== 'expandedLetter'}
                                >
                                    <div className={Style.letterMotion}>
                                        <img className={Style.letterPaper} src={contactLetter} alt="" />
                                        <div className={Style.letterContent}>
                                            <h2>LET'S KEEP IN TOUCH.</h2>
                                            <p>Thanks for stopping by my little world.</p>
                                            <div className={Style.contactLine}>
                                                <strong>EMAIL</strong>
                                                <span>3225798052@qq.com</span>
                                            </div>
                                            <div className={Style.contactLine}>
                                                <strong>WECHAT</strong>
                                                <span>eduoyiz</span>
                                            </div>
                                            <p className={Style.letterSignoff}>See you somewhere,<br />Joyce</p>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    className={Style.envelopeFrontButton}
                                    style={getLayoutStyle(CONTACT_ENVELOPE_LAYOUT.front)}
                                    onClick={handleOpenEnvelopeClick}
                                    aria-label="Pull out contact letter"
                                    aria-disabled={mailState !== 'openEnvelope'}
                                >
                                    <img className={Style.envelopeFront} src={contactEnvelopeOpenFront} alt="" />
                                </button>
                            </div>
                        )}
                    </div>
                )}
                <button
                    type="button"
                    className={Style.contactMailbox}
                    onClick={handleMailboxClick}
                    aria-label={mailState === 'idle' ? 'Open contact mailbox' : 'Close contact mailbox'}
                >
                    <img src={contactMailboxMain} alt="Contact mailbox" draggable="false" />
                </button>
            </div>
          </div>
        </main>
    );
}
