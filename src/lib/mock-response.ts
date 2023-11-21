import { faker } from "@faker-js/faker";
import { mockFetchReservations, type Reservation } from "./mock-reservations";
import { mockFetchItems, type Item } from "./mock-items";

export type FetchResponse = {
  factory: string;
  date: string;
  items: Item[];
  reservations: Reservation[];
};

export function mockFetch(): Promise<FetchResponse> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const factories = ["한국", "중국", "일본", "미국"];
      const reservations = mockFetchReservations().reservations;
      const items = mockFetchItems().items;
      const factory = faker.helpers.arrayElement(factories);
      const date = faker.date.recent().toISOString().split("T")[0];
      resolve({
        factory,
        date,
        items,
        reservations,
      });
    }, 1500);
  });
}
