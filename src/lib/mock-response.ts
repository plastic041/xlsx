import { faker } from "@faker-js/faker";
import { mockFetchReservations, type Reservation } from "./mock-reservations";
import { mockFetchItems, type Item } from "./mock-items";

export type FetchResponse = {
  /**
   * 제철소 이름
   */
  factory: string;
  /**
   * 도시락일 경우 배송일(YYYY-MM-DD). 간식일 경우 기간(YYYY-MM-DD ~ YYYY-MM-DD).
   */
  date: string;
  /**
   * 상품 정보
   */
  items: Item[];
  /**
   * 신청 정보
   */
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
