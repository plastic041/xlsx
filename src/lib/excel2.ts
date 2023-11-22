import XLSX from "xlsx-js-style";
import { sum } from "./utils";
import type { FetchResponse } from "./mock-response";
import type { Item } from "./mock-items";
import type { Reservation } from "./mock-reservations";

/**
 스타일을 적용한 코드입니다. 라이브러리를 바꾸어서 혹시 몰라 파일을 분리했습니다.
 */
const styleHeader = {
  font: { bold: true },
  fill: { fgColor: { rgb: "808080" } },
};

const styleContent = {
  fill: { fgColor: { rgb: "D3D3D3" } },
};

function makeInfoRows(info: { factory: string; date: string }) {
  return [
    [
      {
        v: "지역",
        s: styleHeader,
      },
      info.factory,
    ],
    [
      {
        v: "배송일",
        s: styleHeader,
      },
      info.date,
    ],
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
    [
      {
        v: "메뉴",
        s: styleHeader,
      },
      {
        v: "총계",
        s: styleHeader,
      },
      ...names.map((item) => ({ v: item, s: styleHeader })),
    ],
    [
      {
        v: "수량",
        s: styleHeader,
      },
      total,
      ...counts,
    ],
  ];
}

function makeReservationsRows(reservations: Reservation[]) {
  // 배송지ID, 배송지, 메뉴, 신청인, 직번, 수량

  // 배송지ID별로 묶기
  const deliveryAddressIds = [
    ...new Set(
      reservations.map((reservation) => reservation.deliveryAddressId)
    ),
  ];
  const rows = [];
  for (const deliveryAddressId of deliveryAddressIds) {
    const foundReservations = reservations.filter(
      (reservation) => reservation.deliveryAddressId === deliveryAddressId
    );
    const totalCount = sum(
      foundReservations.map((reservation) => reservation.count)
    );
    const summaryRow = ["배송지ID", "배송지", "메뉴", "신청인", "직번", "수량"];
    rows.push(summaryRow.map((item) => ({ v: item, s: styleHeader })));

    // 배송지ID별로 묶인 것 중에서 메뉴별로 묶기
    const itemNames = [
      ...new Set(foundReservations.map((reservation) => reservation.itemName)),
    ];
    for (const itemName of itemNames) {
      const foundReservationsItemNames = foundReservations.filter(
        (reservation) => reservation.itemName === itemName
      );

      const perItemRows = makeReservationsPerItemsRows(
        foundReservationsItemNames
      );

      rows.push(...perItemRows);
    }

    const totalCountRow = [
      "",
      "",
      "",
      "",
      { v: "총계", s: styleContent },
      { v: totalCount, s: styleContent },
    ]; // 메뉴별 신청 목록 총계

    rows.push(totalCountRow);

    // 여백 3줄
    rows.push([]);
    rows.push([]);
    rows.push([]);
  }

  return rows;
}

/**
 * 신청 정보 요약 줄을 생성합니다.
 */
function makeReservationsPerItemsRows(reservations: Reservation[]) {
  const rows = [];

  // 배송지ID별로 묶인 것 중에서 메뉴별로 묶기
  const itemNames = [
    ...new Set(reservations.map((reservation) => reservation.itemName)),
  ];
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
    rows.push(summaryRow.map((item) => ({ v: item, s: styleContent }))); // 메뉴별 요약

    rows.push(
      ...foundReservationsItemNames.map((reservation) => [
        reservation.deliveryAddressId,
        reservation.deliveryAddress,
        reservation.itemName,
        reservation.reserver.name,
        reservation.reserver.id,
        reservation.count,
      ])
    ); // 메뉴별 신청 목록
  }

  return rows;
}

function makeReservationsIdRows(
  reservations: Reservation[],
  deliveryAddressId: Reservation["deliveryAddressId"]
) {
  const rows = [];
  const foundReservations = reservations.filter(
    (reservation) => reservation.deliveryAddressId === deliveryAddressId
  );
  const totalCount = sum(
    foundReservations.map((reservation) => reservation.count)
  );
  const summaryRow = ["배송지ID", "배송지", "메뉴", "신청인", "직번", "수량"];
  rows.push(summaryRow.map((item) => ({ v: item, s: styleHeader })));

  const itemNames = [
    ...new Set(foundReservations.map((reservation) => reservation.itemName)),
  ];
  for (const itemName of itemNames) {
    const foundReservationsItemNames = foundReservations.filter(
      (reservation) => reservation.itemName === itemName
    );

    const perItemRows = makeReservationsPerItemsRows(
      foundReservationsItemNames
    );

    rows.push(...perItemRows);
  }

  const totalCountRow = [
    "",
    "",
    "",
    "",
    { v: "총계", s: styleContent },
    { v: totalCount, s: styleContent },
  ]; // 메뉴별 신청 목록 총계
  rows.push(totalCountRow);
  return rows;
}

/**
 * 엑셀 파일을 생성합니다.
 */
export function createExcelFileStyle(data: FetchResponse) {
  const workbook = XLSX.utils.book_new();
  const infoRows = makeInfoRows(data);
  const itemRows = makeItemRows(data.items);
  const reservationRows = makeReservationsRows(data.reservations);
  const totalRows = [...infoRows, [], ...itemRows, [], ...reservationRows];
  const worksheet = XLSX.utils.aoa_to_sheet(totalRows);
  XLSX.utils.book_append_sheet(workbook, worksheet, "rows");
  return workbook;
}

export function createExcelFileStyle2(data: FetchResponse) {
  const workbook = XLSX.utils.book_new();
  const deliveryAddressIds = [
    ...new Set(
      data.reservations.map((reservation) => reservation.deliveryAddressId)
    ),
  ];

  for (const deliveryAddressId of deliveryAddressIds) {
    const infoRows = makeInfoRows(data);
    const reservationInfoRows = [
      [{ v: "배송지ID", s: styleHeader }, deliveryAddressId],
      [
        { v: "배송지", s: styleHeader },
        data.reservations.filter(
          (reservations) => reservations.deliveryAddressId === deliveryAddressId
        )[0].deliveryAddress,
      ],
    ];

    const rows = makeReservationsIdRows(data.reservations, deliveryAddressId);
    const totalRows = [...infoRows, ...reservationInfoRows, [], [], ...rows];
    const worksheet = XLSX.utils.aoa_to_sheet(totalRows);
    XLSX.utils.book_append_sheet(workbook, worksheet, deliveryAddressId);
  }

  return workbook;
}

export function createExcelFileStyle3(
  data: FetchResponse,
  deliveryAddress: Reservation["deliveryAddress"]
) {
  const workbook = XLSX.utils.book_new();
  const infoRows = makeInfoRows(data);
  const deliveryAddressId: Reservation["deliveryAddressId"] =
    data.reservations.filter(
      (reservations) => reservations.deliveryAddress === deliveryAddress
    )[0].deliveryAddressId;

  const reservationInfoRows = [
    [{ v: "배송지ID", s: styleHeader }, deliveryAddressId],
    [{ v: "배송지", s: styleHeader }, deliveryAddress],
  ];

  const rows = makeReservationsIdRows(data.reservations, deliveryAddressId);

  const totalRows = [...infoRows, ...reservationInfoRows, [], [], ...rows];
  const worksheet = XLSX.utils.aoa_to_sheet(totalRows);
  XLSX.utils.book_append_sheet(workbook, worksheet, deliveryAddressId);

  return workbook;
}

export function downloadXlsxStyle(workbook: XLSX.WorkBook, filename: string) {
  XLSX.writeFile(workbook, filename);
}
