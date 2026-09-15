import React from 'react';
import styles from './AIFolder.module.scss';

export default function AIFolder({
    color,
    backColor,
    frontColor,
    frontBottomColor,
    label,
    onClick,
    selected = false,
}) {
    const folderStyle = {
        '--ai-folder-back': backColor || color,
        '--ai-folder-front-top': frontColor || color,
        '--ai-folder-front-bottom': frontBottomColor || frontColor || color,
    };

    const activate = () => onClick?.();

    return (
        <div
            className={styles.folder}
            style={folderStyle}
            onClick={activate}
            onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    activate();
                }
            }}
            role={'button'}
            tabIndex={0}
            aria-label={label}
            aria-pressed={selected}
        >
            <div className={styles.back} />
            <div className={`${styles.paper} ${styles.paperOne}`} />
            <div className={`${styles.paper} ${styles.paperTwo}`} />
            <div className={`${styles.paper} ${styles.paperThree}`} />
            <div className={styles.front} />
        </div>
    );
}
