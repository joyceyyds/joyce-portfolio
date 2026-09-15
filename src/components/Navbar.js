import React from 'react';
import Style from './Navbar.module.scss';
import { Link } from 'react-router-dom';
import { Box } from "@mui/material";

const links = [
    {
        name: '首页',
        englishName: 'HOME',
        to: '',
        active: 'home'
    },
    {
        name: '作品',
        englishName: 'WORKS',
        to: 'portfolio',
        active: 'portfolio'
    },
    {
        name: '关于',
        englishName: 'ABOUT',
        to: 'about',
        active: 'about'
    },
    {
        name: '联系',
        englishName: 'CONTACT',
        to: 'contact',
        active: 'contact'
    }
]

export default function Navbar({active, setActive}) {

    return (
        <Box component={'nav'} className={Style.navbar} aria-label={'Primary navigation'}>
            <Box component={'ul'} className={Style.navGroup}>
                {links.map((link, index) => (
                    <Box
                        key={index}
                        component={'li'}
                        className={`${Style.navItem} ${(link.active === active) ? Style.active : ''}`}
                    >
                        {link.to !== undefined ? (
                            <Link to={`/${link.to}`}
                                onClick={() => setActive(link.active)} className={Style.link}>
                                <span className={Style.navLabel}>
                                    <span>{link.name}</span>
                                    <span className={Style.englishLabel}>{link.englishName}</span>
                                    <svg
                                        className={Style.handDrawnLine}
                                        viewBox="0 0 48 6"
                                        preserveAspectRatio="none"
                                        aria-hidden="true"
                                    >
                                        <path pathLength="1" d="M1 3.8 C8 2.2 14 4.1 21 3.1 C29 2 36 3.9 47 2.7" />
                                    </svg>
                                </span>
                            </Link>
                        ) : (
                            <span className={Style.navLabel}>
                                <span>{link.name}</span>
                                <span className={Style.englishLabel}>{link.englishName}</span>
                                <svg
                                    className={Style.handDrawnLine}
                                    viewBox="0 0 48 6"
                                    preserveAspectRatio="none"
                                    aria-hidden="true"
                                >
                                    <path pathLength="1" d="M1 3.8 C8 2.2 14 4.1 21 3.1 C29 2 36 3.9 47 2.7" />
                                </svg>
                            </span>
                        )}
                    </Box>
                ))}
            </Box>
        </Box>
    )
}
