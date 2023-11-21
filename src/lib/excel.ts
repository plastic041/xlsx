import XLSX from "xlsx";
import { sum } from "./utils";
import type { FetchResponse } from "./mock-response";
import type { Item } from "./mock-items";
import type { Reservation } from "./mock-reservations";

function makeInfoRows(info: { factory: string; date: string }) {
  return [
    ["지역", info.factory],
    ["배송일", info.date],
  ];
}

function makeItemRows(items: Item[]) {
  // 메뉴, 총계, ...items.names
  // 수량, 총계 수량, ...items.counts
  const names = [...new Set(items.map((item) => item.name))];
  const counts = names.map((name) =>
    sum(items.filter((item) => item.name === name).map((item) => item.count))
  );
  const total = sum(counts);
  return [
    ["메뉴", "총계", ...names],
    ["수량", total, ...counts],
  ];
}

type ReservationRows = (string | number)[][];

function makeReservationsRows(reservations: Reservation[]): ReservationRows {
  // 배송지ID, 배송지, 메뉴, 신청인, 직번, 수량
  const deliveryAddressIds = [
    ...new Set(
      reservations.map((reservation) => reservation.deliveryAddressId)
    ),
  ];

  const rows: ReservationRows = [];
  for (const deliveryAddressId of deliveryAddressIds) {
    const foundReservations = reservations.filter(
      (reservation) => reservation.deliveryAddressId === deliveryAddressId
    );
    const totalCount = sum(
      foundReservations.map((reservation) => reservation.count)
    );
    const summaryRow = ["배송지ID", "배송지", "메뉴", "신청인", "직번", "수량"];
    rows.push(summaryRow);

    const itemNames = [
      ...new Set(foundReservations.map((reservation) => reservation.itemName)),
    ];
    console.log(itemNames);

    for (const itemName of itemNames) {
      const foundReservationsItemNames = reservations.filter(
        (reservation) => reservation.itemName === itemName
      );
      const firstReservation = foundReservationsItemNames[0];
      const summaryRow = [
        firstReservation.deliveryAddressId,
        firstReservation.deliveryAddress,
        firstReservation.itemName,
        "---",
        "---",
        sum(foundReservationsItemNames.map((reservation) => reservation.count)),
      ];
      rows.push(summaryRow);

      rows.push(
        ...foundReservationsItemNames.map((reservation) => [
          reservation.deliveryAddressId,
          reservation.deliveryAddress,
          reservation.itemName,
          reservation.reserver.name,
          reservation.reserver.id,
          reservation.count,
        ])
      );
    }

    const totalCountRow = ["", "", "", "", "총계", totalCount];

    rows.push(totalCountRow);
    rows.push([]);
    rows.push([]);
    rows.push([]);
  }

  return rows;
}

export function createExcelFile(data: FetchResponse) {
  const infoRows = makeInfoRows(data);
  const itemRows = makeItemRows(data.items);
  const reservationRows = makeReservationsRows(data.reservations);
  const rows = [...infoRows, [], ...itemRows, [], ...reservationRows];
  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "rows");

  return workbook;
}

export function downloadXlsx(workbook: XLSX.WorkBook, filename: string) {
  XLSX.writeFile(workbook, filename);
}
