import React, {useCallback, useEffect, useRef, useState} from 'react';
import {gsap} from 'gsap';
import './AccordionGallery.css';

export default function AccordionGallery({
    items,
    defaultIndex = 0,
    expandRatio = 0.52,
    trigger = 'hover',
    height = 420,
    gap = 10,
    radius = 16,
    duration = 0.6,
    ease = 'power3.out',
    parallax = 0.5,
    tilt = 8,
    stagger = 0.06,
    grayscale = true,
    showLabels = true,
    accentColor = '#ffffff',
    overlayColor = '#060010',
    textColor = '#ffffff',
}) {
    const galleryHeight = typeof height === 'number' ? `${height}px` : height;

    const safeDefaultIndex = Math.min(Math.max(defaultIndex, 0), Math.max(items.length - 1, 0));
    const [activeIndex, setActiveIndex] = useState(safeDefaultIndex);
    const galleryRef = useRef(null);
    const panelRefs = useRef([]);
    const mediaRefs = useRef([]);
    const overlayRefs = useRef([]);
    const barRefs = useRef([]);
    const textRefs = useRef([]);

    const collapsedRatio = items.length > 1 ? (1 - expandRatio) / (items.length - 1) : 1;

    const applyLayout = useCallback(() => {
        const panels = panelRefs.current.slice(0, items.length);
        const media = mediaRefs.current.slice(0, items.length);
        const overlays = overlayRefs.current.slice(0, items.length);
        const bars = barRefs.current.slice(0, items.length);
        const texts = textRefs.current.slice(0, items.length);
        if (!galleryRef.current || panels.some((panel) => !panel)) return;

        gsap.to(panels, {
            flexGrow: (index) => index === activeIndex ? expandRatio : collapsedRatio,
            rotateY: (index) => index === activeIndex ? 0 : index < activeIndex ? tilt : -tilt,
            filter: (index) => grayscale && index !== activeIndex ? 'grayscale(1)' : 'grayscale(0)',
            duration,
            ease,
            stagger: {each: stagger, from: activeIndex},
            overwrite: 'auto',
        });

        gsap.to(media, {
            xPercent: (index) => index === activeIndex ? 0 : index < activeIndex ? -parallax * 10 : parallax * 10,
            scale: (index) => index === activeIndex ? 1 : 1.06,
            duration,
            ease,
            stagger: {each: stagger, from: activeIndex},
            overwrite: 'auto',
        });

        gsap.to(overlays, {
            opacity: (index) => index === activeIndex ? 1 : 0.56,
            duration,
            ease,
            overwrite: 'auto',
        });

        if (showLabels) {
            gsap.to(bars, {
                scaleY: (index) => index === activeIndex ? 1 : 0,
                duration: duration * 0.72,
                ease,
                overwrite: 'auto',
            });
            gsap.to(texts, {
                autoAlpha: (index) => index === activeIndex ? 1 : 0,
                y: (index) => index === activeIndex ? 0 : 12,
                duration: duration * 0.72,
                delay: duration * 0.12,
                ease,
                overwrite: 'auto',
            });
        }
    }, [activeIndex, collapsedRatio, duration, ease, expandRatio, grayscale, items.length, parallax, showLabels, stagger, tilt]);

    useEffect(() => {
        setActiveIndex(safeDefaultIndex);
    }, [safeDefaultIndex]);

    useEffect(() => {
        applyLayout();
    }, [applyLayout]);

    useEffect(() => () => {
        gsap.killTweensOf([
            ...panelRefs.current,
            ...mediaRefs.current,
            ...overlayRefs.current,
            ...barRefs.current,
            ...textRefs.current,
        ]);
    }, []);

    const handleEnter = (index) => {
        if (trigger === 'hover') setActiveIndex(index);
    };

    return (
        <div
            ref={galleryRef}
            className={'accordion-gallery'}
            style={{
                height: galleryHeight,
                gap: `${gap}px`,
                '--ag-radius': `${radius}px`,
                '--ag-accent': accentColor,
                '--ag-overlay': overlayColor,
                '--ag-text': textColor,
            }}
        >
            {items.map((item, index) => {
                const isActive = index === activeIndex;
                const Tag = item.link ? 'a' : 'div';
                const linkProps = item.link ? {
                    href: item.link,
                    target: '_blank',
                    rel: 'noopener noreferrer',
                } : {};
                return (
                    <Tag
                        {...linkProps}
                        ref={(node) => { panelRefs.current[index] = node; }}
                        className={`ag-panel ${isActive ? 'is-active' : ''}`}
                        style={{flexGrow: isActive ? expandRatio : collapsedRatio}}
                        key={`${item.label}-${item.image}`}
                        onMouseEnter={() => handleEnter(index)}
                        onFocus={() => setActiveIndex(index)}
                        onClick={(event) => {
                            if (index !== activeIndex) {
                                event.preventDefault();
                                setActiveIndex(index);
                                return;
                            }
                            if (!item.link && trigger === 'click') setActiveIndex(index);
                        }}
                        aria-label={`AI 视频作品 ${item.label}`}
                        tabIndex={0}
                    >
                        <div className={'ag-panel__frame'}>
                            <img
                                ref={(node) => { mediaRefs.current[index] = node; }}
                                className={'ag-panel__media'}
                                src={item.image}
                                alt={item.alt || ''}
                            />
                            <div
                                ref={(node) => { overlayRefs.current[index] = node; }}
                                className={'ag-panel__overlay'}
                            />
                            {showLabels && item.label && (
                                <div className={'ag-panel__label'}>
                                    <span
                                        ref={(node) => { barRefs.current[index] = node; }}
                                        className={'ag-panel__bar'}
                                    />
                                    <span
                                        ref={(node) => { textRefs.current[index] = node; }}
                                        className={'ag-panel__text'}
                                    >
                                        {item.label}
                                    </span>
                                </div>
                            )}
                        </div>
                    </Tag>
                );
            })}
        </div>
    );
}
