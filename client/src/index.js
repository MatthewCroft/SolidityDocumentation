import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter,Routes,Route } from "react-router-dom";
import SimpleStorage from './SimpleStorage';
import SimpleAuction from './auction/SimpleAuction';
import SafePurchase from './purchase/SafePurchase';

ReactDOM.render(
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="storage" element={<SimpleStorage />} />
                <Route path="auction" element={<SimpleAuction />} />
                <Route path="purchase" element={< SafePurchase />} />
            </Routes>
        </BrowserRouter>
, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
