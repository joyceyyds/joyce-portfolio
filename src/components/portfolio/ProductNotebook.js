import React, {useEffect, useRef, useState} from 'react';
import Style from './ProductNotebook.module.scss';
import notebook from '../../assets/works/product/product-notebook-open.png';

const allProjects = [
    ['01', 'AI 视频生成工作流', 'PPT 到视频的自动化生成方案', ''],
    ['03', '候鸟与留守', '春运背后的家庭迁徙图谱', 'INTERACTIVE DATA STORY'],
    ['02', 'AIGC 互动内容策划', '《王者荣耀》灵宝日记 · 生成链路优化', ''],
    ['04', 'JOYCE PORTFOLIO', '个人作品集网站', 'VIBE CODING'],
];

const projects = allProjects.filter(([id]) => id === '01' || id === '02');

function ProjectContent({project}) {
    return <><span className={Style.projectNumber}>{project[0]}</span><strong>{project[1]}</strong><em>{project[2]}</em>{project[3] && <small>{project[3]}</small>}</>;
}

function Project({project, onAlreadyHere, showAlreadyHere}) {
    if (project[0] === '03') {
        return <a className={Style.project} href="https://joyceyyds.github.io/migration-news/" target="_blank" rel="noopener noreferrer">
            <ProjectContent project={project} />
            <span className={Style.liveWebsite}>Live Website ↗</span>
        </a>;
    }

    if (project[0] === '04') {
        return <button type="button" className={Style.project} onClick={onAlreadyHere}>
            <ProjectContent project={project} />
            <span className={`${Style.alreadyHere} ${showAlreadyHere ? Style.alreadyHereVisible : ''}`} aria-live="polite">You're already here :)</span>
        </button>;
    }

    return <button type="button" className={Style.project}>
        <ProjectContent project={project} />
    </button>;
}

export default function ProductNotebook({isOpen, onClose}) {
    const [showAlreadyHere, setShowAlreadyHere] = useState(false);
    const alreadyHereTimer = useRef(null);
    useEffect(() => {
        const close = (event) => {
            if (event.key !== 'Escape' || !isOpen) return;
            onClose();
        };
        window.addEventListener('keydown', close);
        return () => window.removeEventListener('keydown', close);
    }, [isOpen, onClose]);
    useEffect(() => () => window.clearTimeout(alreadyHereTimer.current), []);

    const handleAlreadyHere = () => {
        window.clearTimeout(alreadyHereTimer.current);
        setShowAlreadyHere(true);
        alreadyHereTimer.current = window.setTimeout(() => setShowAlreadyHere(false), 1800);
    };

    if (!isOpen) return null;
    return <div className={Style.overlay} onClick={onClose} role="presentation">
        <section className={Style.wrapper} style={{'--notebook-width': '39.9vw'}} onClick={(event) => event.stopPropagation()} aria-label="Product projects">
            <img src={notebook} alt="" />
            <div className={Style.content}>
                <div className={Style.productHeading}><h1>PRODUCT</h1><i /></div>
                <div className={Style.projectGrid}>{projects.map((p) => <Project
                    key={p[0]}
                    project={p}
                    onAlreadyHere={handleAlreadyHere}
                    showAlreadyHere={showAlreadyHere && p[0] === '04'}
                />)}</div>
            </div>
        </section>
    </div>;
}
