
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Access the root element and create a root for it, if it exists
const rootElement = document.getElementById("root");

if (rootElement) {
  createRoot(rootElement).render(<App />);
} else {
  console.error("Root element not found");
}
