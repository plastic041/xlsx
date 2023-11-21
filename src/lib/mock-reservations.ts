import { faker } from "@faker-js/faker";
import { ITEMS } from "./mock-items";

faker.seed(0);

const CITIES = [
  "서울",
  "경기",
  "인천",
  "강원",
  "충북",
  "충남",
  "대전",
  "경북",
  "경남",
  "대구",
  "전북",
  "전남",
  "광주",
  "부산",
  "울산",
  "제주",
  "세종",
] as const;

export type Reservation = {
  deliveryAddressId: `배송지-${(typeof CITIES)[number]}`; // ${faker.helpers.arrayElement(CITIES)}}
  deliveryAddress: (typeof CITIES)[number];
  itemName: string;
  reserver: {
    id: string;
    name: string;
  };
  count: number;
};

export function mockFetchReservations(): {
  reservations: Reservation[];
} {
  const reservations = Array.from({ length: 100 }, () => {
    const city = faker.helpers.arrayElement(CITIES);

    return {
      deliveryAddressId: `배송지-${city}` as const,
      deliveryAddress: city,
      itemName: faker.helpers.arrayElement(ITEMS),
      reserver: {
        id: faker.string.uuid(),
        name: faker.person.firstName(),
      },
      count: faker.number.int({ min: 1, max: 100 }),
    };
  });
  return { reservations };
}
