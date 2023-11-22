import { useState } from "react";
//import { createExcelFile, downloadXlsx } from "../lib/excel";
import { createExcelFileStyle, downloadXlsxStyle } from "../lib/excel2";
import { mockFetch } from "../lib/mock-response";
import { match } from "ts-pattern";

export function DownloadButton() {
  const [state, setState] = useState("idle");

  return (
    <button
      onClick={async () => {
        setState("loading");
        const data = await mockFetch();

        setState("creating");
        const excelFile = createExcelFileStyle(data);

        setState("downloading");
        downloadXlsxStyle(excelFile, "example.xlsx");

        setState("complete");
      }}
    >
      {match(state)
        .with("idle", () => "Download")
        .with("loading", () => "Loading...")
        .with("creating", () => <Spinner />)
        .with("downloading", () => "Downloading...")
        .with("complete", () => "Complete!")
        .otherwise(() => "Unknown state")}
    </button>
  );
}

export function Spinner() {
  return (
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900" />
  );
}
