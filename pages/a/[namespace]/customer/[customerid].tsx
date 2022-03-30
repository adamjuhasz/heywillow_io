import { ReactElement } from "react";
import { useRouter } from "next/router";

import AppLayout from "layouts/app";
import useGetCustomer from "client/getCustomer";

export default function Customer() {
  const router = useRouter();
  const { customerid } = router.query;

  const customerId =
    customerid !== undefined ? parseInt(customerid as string, 10) : customerid;

  const { data: customer } = useGetCustomer(customerId);
  return <>{JSON.stringify(customer)}</>;
}

Customer.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
