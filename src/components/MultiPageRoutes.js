import Home from "./home/Home";
import About from "./about/About";
import Portfolio from "./portfolio/Portfolio";
import Contact from "./contact/Contact";
import React from 'react';
import { Route, Routes } from 'react-router-dom';

export default function MultiPageRoutes({onEnterStudio}) {
    return (
        <Routes>
            <Route exact path={'/'} element={<Home onEnterStudio={onEnterStudio} />} />
            <Route exact path={'/about'} element={<About />} />
            <Route exact path={'/portfolio'} element={<Portfolio />} />
            <Route exact path={'/contact'} element={<Contact />} />
        </Routes>
    )
}
