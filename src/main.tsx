import React from "react";
import ReactDOM from "react-dom/client";
import "primeicons/primeicons.css";
import { PrimeReactProvider } from "primereact/api";
import "primeflex/primeflex.css";
import "primereact/resources/primereact.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";

import "./index.css";
import App from "./App";

const rootElement = document.getElementById("root");
  const root = ReactDOM.createRoot(rootElement as HTMLElement);
  root.render(
    <React.StrictMode>
      <PrimeReactProvider>
        <App />
      </PrimeReactProvider>
    </React.StrictMode>
  );
