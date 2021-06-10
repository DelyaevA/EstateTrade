import React from 'react';
import ReactDOM from 'react-dom';
import recoilPersist from "recoil-persist";
import App from './app/App';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
// Importing the Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';

import { BrowserRouter as Router } from 'react-router-dom';
import {RecoilRoot} from "recoil";

const { RecoilPersist, updateState } = recoilPersist([], {
    key: "recoil-persist",
    storage: sessionStorage,
});

ReactDOM.render(
    <RecoilRoot initializeState={updateState}>
        <RecoilPersist />
        <Router>
            <App />
        </Router>
    </RecoilRoot>,
    document.getElementById('root')
);

registerServiceWorker();
