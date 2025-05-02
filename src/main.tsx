import "react-day-picker/dist/style.css";
import "./index.css";
import { createRoot } from "react-dom/client";
import App from "./App";
import { ThemeProvider } from "./components/ui/theme-provider";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider defaultTheme="light" storageKey="skedlii-theme">
    <App />
  </ThemeProvider>
);
