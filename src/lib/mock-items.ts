import { faker } from "@faker-js/faker";

faker.seed(0);

export const ITEMS = [
  "아메리카노",
  "카페라떼",
  "카페모카",
  "카라멜마끼아또",
  "플랫화이트",
  "바닐라라떼",
];

export type Item = {
  id: number;
  name: string;
  /**
   * 신청 수량
   */
  count: number;
};

/*매출내역의 아이템 타입은 수량이 없어서 일단 분리했습니다.*/
export type OrderItem = {
  id: number;
  name: string;
};

export function mockFetchItems(): {
  items: Item[];
} {
  const items = Array.from({ length: 100 }, () => ({
    id: faker.number.int(),
    name: faker.helpers.arrayElement(ITEMS),
    count: faker.number.int({ min: 1, max: 100 }),
  }));
  return { items };
}

/*중복없는 아이템 배열 */
export function mockFetchOrderItems(): {
  items: OrderItem[];
} {
  const items = ITEMS.map((item) => ({ id: faker.number.int(), name: item }));
  return { items };
}
