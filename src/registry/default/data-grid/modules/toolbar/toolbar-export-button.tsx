"use client";

import { DownloadIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ToolbarExportButton({
  exportDisabled,
  isExporting,
  onExportCsv,
}: {
  exportDisabled: boolean;
  isExporting: boolean;
  onExportCsv: () => void;
}) {
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      disabled={exportDisabled || isExporting}
      className="shrink-0"
      onClick={onExportCsv}
    >
      <DownloadIcon className="h-3.5 w-3.5" />
      {isExporting ? "Exporting..." : "Export CSV"}
    </Button>
  );
}
