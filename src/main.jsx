import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

const root = createRoot(document.getElementById('root'));

if (process.env.NODE_ENV === "development") {
  import("./mocks/browser").then(({ worker }) => {
    worker.start().then(() => {
      root.render(
        <StrictMode>
          <App />
        </StrictMode>
      );
    });
  });
} else {
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}