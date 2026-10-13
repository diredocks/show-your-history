import { render } from 'solid-js/web';

import './style.css';
import App from './App';

if (!import.meta.env.DEV) {
  document.addEventListener('contextmenu', (e) => {
    const target = e.target as Element | null;
    if (target?.closest('a[href]')) return;
    e.preventDefault();
  });
}

render(() => <App />, document.getElementById('root')!);
