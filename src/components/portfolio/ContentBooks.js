import React, {useEffect} from 'react';
import Style from './ContentBooks.module.scss';
import ContentCardSpread from './content/ContentCardSpread';

export default function ContentBooks({isOpen, onClose}) {
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Escape' && isOpen) onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return <div className={Style.overlay} onClick={onClose} role="presentation">
        <ContentCardSpread />
    </div>;
}
