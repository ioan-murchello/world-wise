import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { CitiesProvider } from './context/CityCTX.jsx';

createRoot(document.getElementById('root')).render(
  <CitiesProvider>
    <App />
  </CitiesProvider>
);
