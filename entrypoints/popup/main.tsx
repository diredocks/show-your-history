import { render } from 'solid-js/web';

import './style.css';
import App from './App';

if (!import.meta.env.DEV) {
  document.addEventListener('contextmenu', (e) => e.preventDefault());
}

render(() => <App />, document.getElementById('root')!);
