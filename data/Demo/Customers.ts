interface DemoCustomer {
  id: number;
  userId: string;
}

export const johnCustomer: DemoCustomer = {
  id: 1,
  userId: "0OOh4WTUCo", // cspell:disable-line
};

export const janeCustomer: DemoCustomer = {
  id: 2,
  userId: "9sMUMO6eIW", // cspell:disable-line
};

export const onboarding1Customer: DemoCustomer = {
  id: 3,
  userId: "bmGWQY95bI", // cspell:disable-line
};

export const onboarding2Customer: DemoCustomer = {
  id: 4,
  userId: "sgXvvSwFrf", // cspell:disable-line
};

export const onboarding3Customer: DemoCustomer = {
  id: 5,
  userId: "qFjR5pXc9X", // cspell:disable-line
};

export const onboarding4Customer: DemoCustomer = {
  id: 6,
  userId: "an9WQmA7UX", // cspell:disable-line
};

export const onboarding5Customer: DemoCustomer = {
  id: 7,
  userId: "eH6W0Jt5uI", // cspell:disable-line
};

const allCustomers: DemoCustomer[] = [
  johnCustomer,
  janeCustomer,
  onboarding1Customer,
  onboarding2Customer,
  onboarding3Customer,
  onboarding4Customer,
  onboarding5Customer,
];
export default allCustomers;
