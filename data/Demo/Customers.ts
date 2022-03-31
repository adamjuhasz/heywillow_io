interface DemoCustomer {
  id: number;
  userId: string;
}

export const johnCustomer: DemoCustomer = {
  id: 1,
  userId: "1ecc0dd45s",
};

const allCustomers: DemoCustomer[] = [johnCustomer];
export default allCustomers;
