/* eslint-disable @next/next/no-img-element */
import { ReactElement } from "react";
import { useRouter } from "next/router";
import type { Prisma } from "@prisma/client";
import isString from "lodash/isString";
import isNil from "lodash/isNil";
import { formatDistanceToNow } from "date-fns";
import Head from "next/head";

import AppLayout from "layouts/app";
import AppHeader from "components/App/HeaderHOC";
import LinkBar, { Link } from "components/LinkBar";
import AppHeaderThreadLink from "components/App/ThreadLink";
import AppContainer from "components/App/Container";
import Avatar from "components/Avatar";
import Loading from "components/Loading";
import CustomerTraitValue from "components/Customer/traits/Value";

import useGetCustomer from "client/getCustomer";
import useGetThread from "client/getThread";

// eslint-disable-next-line sonarjs/cognitive-complexity
export default function Customer() {
  const router = useRouter();
  const { customerid } = router.query;

  const customerId =
    customerid !== undefined ? parseInt(customerid as string, 10) : customerid;

  const { data: customer } = useGetCustomer(customerId);
  const { data: thread } = useGetThread({
    customerId: customerId,
    threadId: undefined,
    aliasEmailId: undefined,
  });

  const traits = (customer?.CustomerTrait || []).reduce(
    (acc, { key, value }) => {
      acc[key] = value;
      return acc;
    },
    {} as Record<string, Prisma.JsonValue>
  );
  const traitKeys = Object.keys(traits);

  const name: string = isString(traits.name)
    ? traits.name
    : `${traits.firstName || ""} ${traits.lastName || ""}`.trim();

  return (
    <>
      <Head>
        <title>{name !== "" ? `${name} on Willow` : "Willow"}</title>
      </Head>
      <AppHeader>
        <LinkBar hideBorder>
          <AppHeaderThreadLink />
          <Link href="/a/[namespace]/customers" exact={false}>
            <div className="flex items-center">Customers</div>
          </Link>
        </LinkBar>
      </AppHeader>

      {customer ? (
        <>
          <div className="w-full border-b border-b-zinc-700 bg-black">
            <AppContainer>
              <div className="flex pb-7 pt-7">
                <div className="mr-2 mt-1.5">
                  {isString(traits.avatar) &&
                  traits.avatar.startsWith("http") ? (
                    <img
                      src={traits.avatar}
                      className="h-8 w-8 rounded-full"
                      alt="User's avatar"
                    />
                  ) : (
                    <Avatar str={`${customer?.id}`} className="h-8 w-8" />
                  )}
                </div>
                <div className="flex flex-col ">
                  <div className="text-base">{customer?.userId}</div>
                  <div className="text-4xl">
                    {name !== "" ? (
                      <span>{name}</span>
                    ) : (
                      <span className="text-zinc-400">FirstName LastName</span>
                    )}
                    <div className="text-2xl">
                      {isString(traits.email) ? (
                        traits.email
                      ) : (
                        <span className="text-zinc-400">No email</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </AppContainer>
          </div>

          <AppContainer>
            <div className="flex pt-7 pb-7">
              <div className="relative w-1/2">
                <table
                  className="w-full table-fixed border-separate text-sm"
                  style={{ borderSpacing: 0 }}
                >
                  <thead className="">
                    <tr className="border-0 bg-zinc-800 text-left text-zinc-400">
                      <th
                        scope="col"
                        className={[
                          "rounded-l-md border-t border-l border-b border-zinc-600 p-3",
                        ].join(" ")}
                      >
                        Trait
                      </th>
                      <th
                        scope="col"
                        className={[
                          "border-b border-t border-l-0 border-zinc-600 p-3 ",
                          "rounded-r-md border-r",
                        ].join(" ")}
                      >
                        Value
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-left">
                    {/* eslint-disable-next-line sonarjs/cognitive-complexity */}
                    {traitKeys.map((key, idx) => (
                      <tr key={key} className="">
                        <td
                          className={[
                            "whitespace-nowrap py-3 px-3 font-medium",
                            idx !== traitKeys.length - 1
                              ? "border-b border-zinc-600"
                              : "",
                          ].join(" ")}
                        >
                          {key}
                        </td>

                        <td
                          className={[
                            "block overflow-x-scroll whitespace-nowrap py-3 px-3",
                            idx !== traitKeys.length - 1
                              ? "border-b border-zinc-600"
                              : "",
                          ].join(" ")}
                        >
                          {isNil(traits[key]) || traits[key] === "" ? (
                            <span className="text-xs text-zinc-400">Empty</span>
                          ) : (
                            <CustomerTraitValue
                              value={traits[key]}
                              expandJSON
                            />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex w-1/2 flex-col px-2">
                <div className="flex flex-col rounded-md border border-zinc-600 p-4 text-sm">
                  <div className="mb-3 text-xl">Threads</div>
                  {thread ? (
                    thread.length === 0 ? (
                      <div className="text-zinc-400">None yet</div>
                    ) : (
                      thread.map((t) => (
                        <div key={t.id}>
                          {
                            t.Message.filter((m) => m.subject !== null)[0]
                              .subject
                          }
                        </div>
                      ))
                    )
                  ) : (
                    <div className="flex w-full items-center justify-center">
                      <Loading className="h-4 w-4" />
                    </div>
                  )}
                </div>

                <div className="h-7" />

                <div className="flex flex-col rounded-md border border-zinc-600 p-4 text-sm">
                  <div className="mb-3 text-xl">Journey</div>
                  {customer.CustomerEvent.length === 0 ? (
                    <div className="text-zinc-400">None yet</div>
                  ) : (
                    customer.CustomerEvent.map((e, idx, arr) => (
                      <div key={e.id} className="relative flex items-center">
                        {idx !== 0 ? (
                          <div className="absolute top-0 ml-[3.5px] h-[calc(50%_-_0.23rem)] w-[1px] bg-zinc-400" />
                        ) : (
                          <></>
                        )}

                        <div className="mr-2 h-2 w-2 rounded-full border-2 border-zinc-400 bg-zinc-900" />

                        <div className="my-0.5">
                          {e.action}{" "}
                          <span className="text-zinc-500">
                            •{" "}
                            {formatDistanceToNow(new Date(e.createdAt), {
                              addSuffix: true,
                            })}
                          </span>
                        </div>

                        {idx !== arr.length - 1 ? (
                          <div className="absolute bottom-0 ml-[3.5px] h-[calc(50%_-_0.23rem)] w-[1px] bg-zinc-400" />
                        ) : (
                          <></>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </AppContainer>
        </>
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
