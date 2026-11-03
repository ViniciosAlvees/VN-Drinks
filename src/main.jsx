import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './styles/index.css';

// O HTML do build já contém o catálogo. React assume a interface e restaura o carrinho local.
createRoot(document.getElementById('root')).render(<StrictMode><App /></StrictMode>);
