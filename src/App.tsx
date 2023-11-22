import { DownloadButton } from "./components/download-button";
import { DownloadButton2 } from "./components/download-button2";
import { DownloadButton3 } from "./components/download-button3";
import { CITIES, Reservation } from "./lib/mock-reservations";

export function App() {
  return (
    <div>
      <DownloadButton />
      <br />
      <DownloadButton2 />
      <br />
      {CITIES.map((item) => (
        <DownloadButton3
          deliveryAddress={item as Reservation["deliveryAddress"]}
        />
      ))}
    </div>
  );
}
