import { ReactElement } from "react";

import AppLayout from "layouts/app";

export default function Customer(props: unknown) {
  return <>{JSON.stringify(props)}</>;
}

Customer.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
