import { useState } from "react";
import { createExcelFile2, downloadXlsx } from "../lib/excel";
import { mockFetch } from "../lib/mock-response";
import { match } from "ts-pattern";
import { Spinner } from "./download-button";

export function DownloadButton2() {
  const [state, setState] = useState("idle");

  return (
    <button
      onClick={async () => {
        setState("loading");
        const data = await mockFetch();

        setState("creating");
        const excelFile = createExcelFile2(data);

        setState("downloading");
        downloadXlsx(excelFile, "example2.xlsx");

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
