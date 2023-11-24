import { faker } from "@faker-js/faker";
import { CITIES, Reservation } from "./mock-reservations";
import { ITEMS } from "./mock-items";

faker.seed(0);

export type Orders = {
  deliveryInfo: {
    code: Reservation["deliveryAddressId"] /*API명세에서는 code: number, name: string이지만 목데이터를 사용하려고 변경하지 않았습니다. */;
    name: Reservation["deliveryAddress"];
  };
  orderInfo: {
    employeeName: string;
    employeeNum: string;
    deliveryDate: string;
    itemName: string;
    count: number;
    price: number;
  };
};

export function mockFetchOrders(): {
  orders: Orders[];
} {
  const orders = Array.from({ length: 100 }, () => {
    const city = faker.helpers.arrayElement(CITIES);
    return {
      deliveryInfo: {
        code: `배송지-${city}` as const,
        name: city,
      },
      orderInfo: {
        itemName: faker.helpers.arrayElement(ITEMS),
        deliveryDate: faker.date.recent().toISOString().split("T")[0],
        employeeName: faker.person.firstName(),
        employeeNum: faker.string.uuid(),
        count: faker.number.int({ min: 1, max: 100 }),
        price: faker.number.int({ min: 1, max: 100000 }),
      },
    };
  });
  return { orders };
}
