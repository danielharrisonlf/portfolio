import React from 'react';
import ReactDOM from 'react-dom/client';

/*
 * A ordem importa: os estilos globais entram ANTES dos módulos dos
 * componentes. Assim o CSS base é emitido primeiro e qualquer regra de
 * componente vence na cascata sem precisar de `!important` — que era
 * exatamente o problema da versão anterior.
 */
import './styles/index.css';
import './styles/theme-transition.css';

import App from './App';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
