import { createRoot } from 'react-dom/client';
import React from "react";
import {App} from './App';
import './index.css';
import { taskStore } from './store';

taskStore.loadFromLocalStorage();

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);