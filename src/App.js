import React from 'react';
import './App.module.scss';
import BaseLayout from "./components/BaseLayout";
import OrientationHint from "./components/OrientationHint";
import {BrowserRouter} from "react-router-dom";

function App() {
   return (
      <div>
         <BrowserRouter basename={process.env.PUBLIC_URL}>
            <BaseLayout/>
         </BrowserRouter>
         <OrientationHint/>
      </div>
   );
}


export default App;
