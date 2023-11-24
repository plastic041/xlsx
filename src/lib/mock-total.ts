import { faker } from "@faker-js/faker";

faker.seed(0);

/*API 매출내역 response에 totalInfo에 해당하는 내용 */
export type TotalInfo = {
  workingSpaceArea: string;
  reservationDate: string;
  totalCount: number;
  totalPrice: number;
};

/* export function mockFetchTotalInfo(): {
  totalInfos: TotalInfo;
} {
  const factories = ["한국", "중국", "일본", "미국"];
  const factory = faker.helpers.arrayElement(factories);
  const totalInfos: TotalInfo = {
    workingSpaceArea: factory,
    reservationDate: faker.date.recent().toISOString().split("T")[0],
    totalCount: faker.number.int({ min: 1, max: 100 }),
    totalPrice: faker.number.int({ min: 1, max: 100000 }),
  };
  return { totalInfos };
} */
