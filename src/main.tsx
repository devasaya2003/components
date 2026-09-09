import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { DocsLayout } from "@/components/docs/docs-layout";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DataGridAdvancedPage } from "@/pages/docs/data-grid-advanced";
import { DataGridApiPage } from "@/pages/docs/data-grid-api";
import { DataGridOverviewPage } from "@/pages/docs/data-grid-overview";
import { DataGridPrimitivesPage } from "@/pages/docs/data-grid-primitives";
import { HomePage } from "@/pages/home-page";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TooltipProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<DocsLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/docs/data-grid" element={<DataGridOverviewPage />} />
            <Route
              path="/docs/data-grid/primitives"
              element={<DataGridPrimitivesPage />}
            />
            <Route
              path="/docs/data-grid/advanced"
              element={<DataGridAdvancedPage />}
            />
            <Route path="/docs/data-grid/api" element={<DataGridApiPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </StrictMode>,
);
