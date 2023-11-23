import { faker } from "@faker-js/faker";
import { sum } from "./utils";
import { mockFetchReservations, type Reservation } from "./mock-reservations";
import {
  mockFetchItems,
  mockFetchOrderItems,
  type OrderItem,
  type Item,
} from "./mock-items";
import { mockFetchOrders, type Orders } from "./mock-orders";

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

/*매출내역 엑셀 */
export type FetchOrderResponse = {
  /**
   * 제철소 이름
   */
  factory: string;
  /**
   * 배송일(YYYY-MM-DD)
   */
  date: string;
  /**
   * 상품 정보
   */
  items: OrderItem[]; // 중복 없는 아이템 배열
  /**
   * 신청 정보
   */
  orders: Orders[];
  totalCount: number;
  totalPrice: number;
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

export function mockOrderFetch(): Promise<FetchOrderResponse[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const orderList: FetchOrderResponse[] = Array.from(
        { length: 100 },
        () => {
          const factories = ["한국", "중국", "일본", "미국"];
          const factory = faker.helpers.arrayElement(factories);
          const date = faker.date.recent().toISOString().split("T")[0];
          const items = mockFetchOrderItems().items;
          const orders = mockFetchOrders().orders;
          const totalCount = sum(orders.map((order) => order.count));
          const totalPrice = sum(orders.map((order) => order.price));

          return {
            factory: factory,
            date: date,
            items: items,
            orders: orders,
            totalCount: totalCount,
            totalPrice: totalPrice,
          };
        }
      );

      resolve(orderList);
    }, 1500);
  });
}
