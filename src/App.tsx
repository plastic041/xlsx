import { DownloadButton } from "./components/download-button";
import { DownloadButton2 } from "./components/download-button2";
import { DownloadButton3 } from "./components/download-button3";
import { DownloadButton4 } from "./components/download-button4";
import { CITIES, Reservation } from "./lib/mock-reservations";

export function App() {
  return (
    <div>
      <DownloadButton />
      <br />
      <DownloadButton2 />
      <br />
      {CITIES.map((item, idx) => (
        <DownloadButton3
          key={idx}
          deliveryAddress={item as Reservation["deliveryAddress"]}
        />
      ))}
      <br />
      <DownloadButton4 />
    </div>
  );
}
