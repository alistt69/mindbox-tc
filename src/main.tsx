import { createRoot } from "react-dom/client";
import "@/styles/index.scss"
import { StrictMode } from "react";
import { App } from "@/app";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
