import React from 'react';
import './App.module.scss';
import BaseLayout from "./components/BaseLayout";
import OrientationHint from "./components/OrientationHint";
import {BrowserRouter} from "react-router-dom";

function App() {
   const routerBasename = process.env.NODE_ENV === 'production'
      ? process.env.PUBLIC_URL
      : '/';

   return (
      <div>
         <BrowserRouter basename={routerBasename}>
            <BaseLayout/>
         </BrowserRouter>
         <OrientationHint/>
      </div>
   );
}


export default App;
