import uniq from "lodash/uniq";
import NextLink from "next/link";
import isNil from "lodash/isNil";
import { useRouter } from "next/router";
import type { Prisma } from "@prisma/client";

import CustomerTraitValue from "components/Customer/traits/Value";

interface MiniTrait {
  key: string;
  value: Prisma.JsonValue;
}

interface MiniCustomer {
  id: number;
  userId: string;
  CustomerTrait: MiniTrait[];
}

interface Props {
  customers: MiniCustomer[];
  pathPrefix: string;
}

export default function CustomerListTable(props: Props) {
  const router = useRouter();

  const columns = uniq(
    props.customers.flatMap((c) => c.CustomerTrait.map((t) => t.key))
  ).sort();

  return (
    <div className="mt-8 flex flex-col">
      <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
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
                    columns.length === 0
                      ? "rounded-r-md border-r"
                      : "border-r-0",
                  ].join(" ")}
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
              {props.customers.map((customer, idx, arr) => (
                <tr key={customer.id} className="">
                  <td
                    className={[
                      "whitespace-nowrap py-3 px-3 font-medium hover:underline",
                      idx !== arr.length - 1 ? "border-b border-zinc-600" : "",
                    ].join(" ")}
                  >
                    <NextLink
                      href={{
                        pathname:
                          "/[prefix]/[namespace]/customers/[customerid]",
                        query: {
                          ...router.query,
                          customerid: customer.id,
                          prefix: props.pathPrefix,
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
                          idx !== arr.length - 1
                            ? "border-b border-zinc-600"
                            : "",
                        ].join(" ")}
                      >
                        {isNil(value) ? (
                          <span className="text-xs text-zinc-700">Empty</span>
                        ) : (
                          <CustomerTraitValue value={value} maxLength={10} />
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
  );
}