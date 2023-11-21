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
