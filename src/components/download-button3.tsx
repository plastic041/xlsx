import { useState } from "react";
import { createExcelFile3, downloadXlsx } from "../lib/excel";
import { mockFetch } from "../lib/mock-response";
import { match } from "ts-pattern";
import { Spinner } from "./download-button";
import { Reservation } from "../lib/mock-reservations";

/*클릭한 배송지 파일 한개만 다운로드 */
export function DownloadButton3({
  deliveryAddress,
}: {
  deliveryAddress: Reservation["deliveryAddress"];
}) {
  const [state, setState] = useState("idle");

  return (
    <button
      onClick={async () => {
        setState("loading");
        const data = await mockFetch();

        setState("creating");
        const excelFile = createExcelFile3(data, deliveryAddress);

        setState("downloading");
        downloadXlsx(excelFile, `${deliveryAddress}.xlsx`);

        setState("complete");
      }}
    >
      {match(state)
        .with("idle", () => `${deliveryAddress}`)
        .with("loading", () => "Loading...")
        .with("creating", () => <Spinner />)
        .with("downloading", () => "Downloading...")
        .with("complete", () => "Complete!")
        .otherwise(() => "Unknown state")}
    </button>
  );
}
