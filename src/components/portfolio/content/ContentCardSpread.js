import React from 'react';
import Style from './ContentCardSpread.module.scss';
import facai from '../../../assets/works/content/facai-optimized.png';
import joyceAi from '../../../assets/works/content/joyce-ai-optimized.png';
import liubai from '../../../assets/works/content/liubai-optimized.png';

const CARDS = [
    {id: 'facai', image: facai, alt: '发财头像铺', url: 'https://mp.weixin.qq.com/s/QDugsSholwlLW01EDkCVUQ'},
    {id: 'joyce-ai', image: joyceAi, alt: 'Joyce 的 AI 日记', url: 'https://xhslink.cn/o/86eRcx60VnK'},
    {id: 'liubai', image: liubai, alt: '留白', url: 'https://xhslink.cn/o/9Vvv3BWHhk2'},
];

export default function ContentCardSpread() {
    return <section
        className={Style.spread}
        onClick={(event) => event.stopPropagation()}
        aria-label="Content projects preview"
    >
        {CARDS.map((card, index) => (
            <a
                className={`${Style.card} ${Style[`card${index + 1}`]}`}
                key={card.id}
                href={card.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${card.alt}（在新标签页打开）`}
            >
                <img src={card.image} alt={card.alt} draggable="false" />
                <span className={Style.cardHint}>点击查看 ↗</span>
            </a>
        ))}
    </section>;
}
