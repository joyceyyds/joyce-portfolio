import React from 'react';
import Style from './ProductDetailSheet.module.scss';
import detailPaper from '../../../assets/works/product/product-detail-paper.png';

function Workflow({groups}) {
    return <div className={Style.workflow}>
        {groups.map((group) => <div className={Style.workflowGroup} key={group.title}>
            <strong>{group.title}</strong>
            <p>{group.flow}</p>
        </div>)}
    </div>;
}

export default function ProductDetailSheet({project, onClose}) {
    if (!project) return null;

    const handleOverlayClick = (event) => {
        event.stopPropagation();
        if (event.target === event.currentTarget) onClose();
    };

    return <div className={Style.overlay} onClick={handleOverlayClick} role="presentation">
        <article className={Style.sheet} onClick={(event) => event.stopPropagation()} aria-label={`${project.heading} project detail`}>
            <img className={Style.paper} src={detailPaper} alt="" />
            <div className={Style.content}>
                <header className={Style.header}>
                    <h2>{project.heading}</h2>
                    <div className={Style.subtitleRow}>
                        <h3>{project.subtitle}</h3>
                        <p className={Style.meta}>{project.meta}</p>
                    </div>
                    <p className={Style.intro}>{project.intro}</p>
                    <i className={Style.divider} />
                </header>

                <section className={`${Style.section} ${Style.sectionOne}`}>
                    <h4>01 / 项目背景</h4>
                    <p>{project.background}</p>
                </section>

                <section className={`${Style.section} ${Style.sectionTwo}`}>
                    <h4>02 / 我的职责</h4>
                    <div className={Style.responsibilities}>
                        {project.responsibilities.map(([title, body]) => <div key={title}>
                            <strong>{title}</strong><p>{body}</p>
                        </div>)}
                    </div>
                </section>

                <section className={`${Style.section} ${Style.sectionThree}`}>
                    <h4>03 / 工作流程</h4>
                    <Workflow groups={project.workflows} />
                </section>

                <section className={`${Style.section} ${Style.sectionFour}`}>
                    <h4>04 / 项目产出</h4>
                    {project.outputs.map((output, index) => <p key={index}>
                        {output.parts ? output.parts.map((part, partIndex) => (
                            typeof part === 'string'
                                ? <React.Fragment key={partIndex}>{part}</React.Fragment>
                                : <strong key={partIndex}>{part.emphasis}</strong>
                        )) : <>{output.text}<strong>{output.emphasis}</strong>{output.suffix}</>}
                    </p>)}
                </section>
            </div>
        </article>
    </div>;
}
