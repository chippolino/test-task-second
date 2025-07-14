import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './shared/styles/_global.scss';
import 'swiper/swiper-bundle.css';
import { App } from './app/app';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
