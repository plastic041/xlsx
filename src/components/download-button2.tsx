import { useState } from "react";
import { createExcelFile2, downloadXlsx } from "../lib/excel";
import { mockFetch } from "../lib/mock-response";
import { match } from "ts-pattern";
import { Spinner } from "./download-button";

/*배송지별로 파일 각각 다운로드" -> 여러 파일이 아니라, 배송지명으로 이름지은 sheet 목록을 가진 하나의 파일 */
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
