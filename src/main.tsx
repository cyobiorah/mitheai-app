import { createRoot } from "react-dom/client";
import App from "./App";
import { ThemeProvider } from "./components/ui/theme-provider";
import "./index.css";
import "react-day-picker/style.css";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider defaultTheme="light" storageKey="skedlii-theme">
    <App />
  </ThemeProvider>
);
