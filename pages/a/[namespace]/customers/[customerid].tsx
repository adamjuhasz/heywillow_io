import { ReactElement } from "react";
import { useRouter } from "next/router";

import AppLayout from "layouts/app";
import AppHeader from "components/App/HeaderHOC";
import LinkBar, { Link } from "components/LinkBar";
import AppHeaderThreadLink from "components/App/ThreadLink";
import Loading from "components/Loading";
import CustomerOverview from "components/Customer/Overview";

import useGetCustomer from "client/getCustomer";
import useGetThread from "client/getThread";

// eslint-disable-next-line sonarjs/cognitive-complexity
export default function Customer() {
  const router = useRouter();
  const { customerid } = router.query;

  const customerId =
    customerid !== undefined ? parseInt(customerid as string, 10) : customerid;

  const { data: customer } = useGetCustomer(customerId);
  const { data: threads } = useGetThread({
    customerId: customerId,
    threadId: undefined,
    aliasEmailId: undefined,
  });

  return (
    <>
      <AppHeader>
        <LinkBar hideBorder>
          <AppHeaderThreadLink />
          <Link href="/a/[namespace]/customers" exact={false}>
            <div className="flex items-center">Customers</div>
          </Link>
        </LinkBar>
      </AppHeader>

      {customer ? (
        <CustomerOverview
          id={customer.id}
          userId={customer.userId}
          traits={customer.CustomerTrait}
          events={customer.CustomerEvent}
          threads={threads}
        />
      ) : (
        <div className="absolute flex h-full w-full items-center justify-center">
          <Loading className="h-8 w-8" />
        </div>
      )}
    </>
  );
}

Customer.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};