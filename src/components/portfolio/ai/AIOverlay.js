import React, {useEffect} from 'react';
import AIFolder from './AIFolder';
import AccordionGallery from './AccordionGallery';
import Style from './AIOverlay.module.scss';
import aiVideo01 from '../../../assets/works/ai/video/ai-video-01.webp';
import aiVideo02 from '../../../assets/works/ai/video/ai-video-02.webp';
import aiVideo03 from '../../../assets/works/ai/video/ai-video-03.webp';
import aiVideo04 from '../../../assets/works/ai/video/ai-video-04.webp';
import aiVideo05 from '../../../assets/works/ai/video/ai-video-05.webp';

const AI_VIDEO_ITEMS = [
    {
        image: aiVideo01,
        label: '01',
        alt: 'AI Video 01',
        link: 'https://youtube.com/shorts/oP1SCE3VcHk?si=tC2ufKyXq2kzUrF_',
    },
    {
        image: aiVideo02,
        label: '02',
        alt: 'AI Video 02',
        link: 'https://youtube.com/shorts/XUQgm1te1qA?si=zi316u5j7eAbpQEN',
    },
    {
        image: aiVideo03,
        label: '03',
        alt: 'AI Video 03',
        link: 'https://youtube.com/shorts/PqCB0xKFxnc?si=-CRNTJ5ZwVTN4YOO',
    },
    {
        image: aiVideo04,
        label: '04',
        alt: 'AI Video 04',
        link: 'https://youtube.com/shorts/6A1LKQdlLn0?si=qWqloQbk6aT1sRqj',
    },
    {
        image: aiVideo05,
        label: '05',
        alt: 'AI Video 05',
        link: 'https://youtube.com/shorts/gfYoTJWGV8k?si=4tzgzZkLNMjHfpIS',
    },
];

export const aiProjects = [
    {
        id: 'ai-pet-video',
        title: 'AI 视频创作',
        backColor: '#D6A33F',
        frontColor: '#F4D36F',
        frontBottomColor: '#E8B94F',
    },
];

export default function AIOverlay({isOpen, selectedProject, onSelect, onClose}) {
    const isVideoCreationOpen = selectedProject === 'ai-pet-video';

    useEffect(() => {
        if (!isOpen) return undefined;
        const handleKeyDown = (event) => {
            if (event.key !== 'Escape') return;
            if (selectedProject) {
                onSelect(null);
                return;
            }
            onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose, onSelect, selectedProject]);

    if (!isOpen) return null;

    return (
        <div
            className={Style.overlay}
            onClick={(event) => {
                if (event.target !== event.currentTarget) return;
                if (isVideoCreationOpen) {
                    onSelect(null);
                    return;
                }
                onClose();
            }}
            role={'presentation'}
        >
            <section
                className={`${Style.interface} ${isVideoCreationOpen ? Style.detailInterface : ''}`}
                onClick={(event) => {
                    event.stopPropagation();
                    if (isVideoCreationOpen && event.target === event.currentTarget) {
                        onSelect(null);
                    }
                }}
                aria-label={'AI 作品'}
            >
                {isVideoCreationOpen ? (
                    <div
                        className={Style.galleryArea}
                        onClick={(event) => event.stopPropagation()}
                    >
                        <AccordionGallery
                            items={AI_VIDEO_ITEMS}
                            defaultIndex={2}
                            expandRatio={0.52}
                            trigger={'hover'}
                            height={360}
                            gap={10}
                            radius={16}
                            duration={0.6}
                            ease={'power3.out'}
                            parallax={0.5}
                            tilt={8}
                            stagger={0.06}
                            grayscale={true}
                            showLabels={false}
                        />
                        <p className={Style.galleryHint}>
                            点击卡片即可观看 · YouTube 可能需要科学上网
                        </p>
                    </div>
                ) : (
                    <div className={Style.folderGroup}>
                        {aiProjects.map((project) => (
                            <div className={Style.project} key={project.id}>
                                <div className={Style.folderStage}>
                                    <AIFolder
                                        label={project.title}
                                        backColor={project.backColor}
                                        frontColor={project.frontColor}
                                        frontBottomColor={project.frontBottomColor}
                                        selected={selectedProject === project.id}
                                        onClick={() => onSelect(project.id)}
                                    />
                                </div>
                                <span className={Style.projectTitle}>{project.title}</span>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
