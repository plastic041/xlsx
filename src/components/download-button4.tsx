import { useState } from "react";
import { createExcelFileStyle4, downloadXlsxStyle } from "../lib/excel2";
import { mockOrderFetch } from "../lib/mock-response";
import { match } from "ts-pattern";
import { Spinner } from "./download-button";

/*매출내역 전체 엑셀파일 다운로드 */
export function DownloadButton4() {
  const [state, setState] = useState("idle");

  return (
    <button
      onClick={async () => {
        setState("loading");
        const data = await mockOrderFetch();
        console.log(data);

        setState("creating");
        //const excelFile = createExcelFileStyle4(data);

        setState("downloading");
        // downloadXlsxStyle(excelFile, "exampleOrder.xlsx");

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
