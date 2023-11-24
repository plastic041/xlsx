import { faker } from "@faker-js/faker";

faker.seed(0);

/*API 매출내역 response에 totalInfo에 해당하는 내용 */
export type TotalInfo = {
  workingSpaceArea: string;
  reservationDate: string;
  totalCount: number;
  totalPrice: number;
};
