import { faker } from "@faker-js/faker";
import { CITIES, Reservation } from "./mock-reservations";
import { ITEMS } from "./mock-items";

faker.seed(0);

export type Orders = {
  deliveryAddressId: Reservation["deliveryAddressId"];
  deliveryAddress: Reservation["deliveryAddress"];
  itemName: string;
  userInfo: {
    name: string;
    userCode: string;
  };
  count: number;
  price: number;
};

export function mockFetchOrders(): {
  orders: Orders[];
} {
  const orders = Array.from({ length: 100 }, () => {
    const city = faker.helpers.arrayElement(CITIES);
    return {
      deliveryAddressId: `배송지-${city}` as const,
      deliveryAddress: city,
      itemName: faker.helpers.arrayElement(ITEMS),
      userInfo: {
        name: faker.person.firstName(),
        userCode: faker.string.uuid(),
      },
      count: faker.number.int({ min: 1, max: 100 }),
      price: faker.number.int({ min: 1, max: 100000 }),
    };
  });
  return { orders };
}
