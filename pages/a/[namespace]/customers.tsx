import { ReactElement } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import uniq from "lodash/uniq";
import NextLink from "next/link";
import isNil from "lodash/isNil";

import AppLayout from "layouts/app";
import AppHeader from "components/App/HeaderHOC";
import LinkBar, { Link } from "components/Settings/LinkBar";
import NumberBadge from "components/App/NumberBadge";
import CustomerTraitValue from "components/CustomerTrait/Value";

import useGetTeams from "client/getTeams";
import useGetTeamThreads from "client/getTeamThreads";
import useGetCustomers from "client/getCustomers";

export default function CustomerList() {
  const router = useRouter();

  const { namespace } = router.query;
  const { data: teams } = useGetTeams();

  const currentTeam = teams?.find((t) => t.Namespace.namespace === namespace);
  const currentTeamId = currentTeam?.id;

  const { data: threads } = useGetTeamThreads(currentTeamId);
  const { data: customers } = useGetCustomers(currentTeamId);

  const columns = uniq(
    (customers || []).flatMap((c) => c.CustomerTrait.map((t) => t.key))
  ).sort();

  console.log(columns);

  return (
    <>
      <Head>
        <title>
          {currentTeam ? `${currentTeam.name} on Willow` : "Willow"}
        </title>
      </Head>

      <AppHeader>
        <LinkBar hideBorder>
          <Link href="/a/[namespace]/workspace">
            <div className="flex items-center">
              Threads
              {threads && threads.length > 0 ? (
                <NumberBadge
                  count={threads?.length}
                  className="bg-blue-500 text-white"
                />
              ) : (
                <></>
              )}
            </div>
          </Link>
          <Link href="/a/[namespace]/customers">
            <div className="flex items-center">Customers</div>
          </Link>
        </LinkBar>
      </AppHeader>

      <div
        className={[
          " overflow-x-scroll px-4",
          columns.length > 8 ? "w-full" : "mx-auto max-w-6xl",
        ].join(" ")}
      >
        {customers ? (
          <div className="mt-8 flex flex-col">
            <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                <table
                  className="min-w-full table-fixed border-separate text-sm"
                  style={{ borderSpacing: 0 }}
                >
                  <thead className="">
                    <tr className="border-0 bg-zinc-800 text-left text-zinc-400">
                      <th
                        scope="col"
                        className="rounded-l-md border-t border-l border-b border-r-0 border-zinc-600 p-3"
                      >
                        id
                      </th>
                      {columns.map((col, idx) => (
                        <th
                          key={col}
                          scope="col"
                          className={[
                            "border-b border-t border-l-0 border-zinc-600 p-3 ",
                            idx === columns.length - 1
                              ? "rounded-r-md border-r"
                              : "border-r-0",
                          ].join(" ")}
                        >
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="text-left">
                    {/* eslint-disable-next-line sonarjs/cognitive-complexity */}
                    {customers.map((customer, idx) => (
                      <tr key={customer.id} className="">
                        <td
                          className={[
                            "whitespace-nowrap py-3 px-3 font-medium hover:underline",
                            idx !== customers.length - 1
                              ? "border-b border-zinc-600"
                              : "",
                          ].join(" ")}
                        >
                          <NextLink
                            href={{
                              pathname:
                                "/a/[namespace]/customer/[customerid]/thread",
                              query: {
                                ...router.query,
                                customerid: customer.id,
                              },
                            }}
                          >
                            <a>
                              {customer.userId.length > 12
                                ? `${customer.userId.slice(0, 10)}...`
                                : customer.userId}
                            </a>
                          </NextLink>
                        </td>
                        {columns.map((col) => {
                          const value = customer.CustomerTrait.find(
                            (ct) => ct.key === col
                          )?.value;

                          return (
                            <td
                              key={col}
                              className={[
                                "whitespace-nowrap py-3 px-3",
                                idx !== customers.length - 1
                                  ? "border-b border-zinc-600"
                                  : "",
                              ].join(" ")}
                            >
                              {isNil(value) ? (
                                <span className="text-xs text-zinc-700">
                                  Empty
                                </span>
                              ) : (
                                <CustomerTraitValue
                                  value={value}
                                  maxLength={10}
                                />
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-8 flex flex-col">
            <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                <table
                  className="min-w-full table-fixed border-separate text-sm"
                  style={{ borderSpacing: 0 }}
                >
                  <thead className="">
                    <tr className="border-0 bg-zinc-800 text-left text-zinc-400">
                      <th
                        scope="col"
                        className="rounded-l-md border-t border-l border-b border-r-0 border-zinc-600 p-3"
                      >
                        &nbsp;
                      </th>
                      <th
                        scope="col"
                        className={
                          "border-b border-t border-l-0 border-r-0 border-zinc-600 p-3 "
                        }
                      >
                        &nbsp;
                      </th>
                      <th
                        scope="col"
                        className={
                          "rounded-r-md border-b border-t border-l-0 border-r-0 border-zinc-600 p-3"
                        }
                      >
                        &nbsp;
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-600 text-left">
                    <tr>
                      <td className="border-b border-zinc-600 py-3 px-3">
                        &nbsp;
                      </td>
                      <td className="border-b border-zinc-600 py-3 px-3">
                        &nbsp;
                      </td>
                      <td className="border-b border-zinc-600 py-3 px-3">
                        &nbsp;
                      </td>
                    </tr>
                    <tr>
                      <td className="border-b border-zinc-600 py-3 px-3">
                        &nbsp;
                      </td>
                      <td className="border-b border-zinc-600 py-3 px-3">
                        &nbsp;
                      </td>
                      <td className="border-b border-zinc-600 py-3 px-3">
                        &nbsp;
                      </td>
                    </tr>
                    <tr>
                      <td className="border-b border-zinc-600 py-3 px-3">
                        &nbsp;
                      </td>
                      <td className="border-b border-zinc-600 py-3 px-3">
                        &nbsp;
                      </td>
                      <td className="border-b border-zinc-600 py-3 px-3">
                        &nbsp;
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

CustomerList.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
