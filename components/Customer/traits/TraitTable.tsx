import isNil from "lodash/isNil";
import type { Prisma } from "@prisma/client";

import CustomerTraitValue from "components/Customer/traits/Value";

interface MiniTrait {
  key: string;
  value: Prisma.JsonValue;
}

interface Props {
  traits: MiniTrait[];
}

export default function CustomerTraitTable(props: Props): JSX.Element {
  const traits = props.traits.reduce((acc, { key, value }) => {
    acc[key] = value;
    return acc;
  }, {} as Record<string, Prisma.JsonValue>);

  const traitKeys = Object.keys(traits);

  return (
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
                idx !== traitKeys.length - 1 ? "border-b border-zinc-600" : "",
              ].join(" ")}
            >
              {key}
            </td>

            <td
              className={[
                "block overflow-x-scroll whitespace-nowrap py-3 px-3",
                idx !== traitKeys.length - 1 ? "border-b border-zinc-600" : "",
              ].join(" ")}
            >
              {isNil(traits[key]) || traits[key] === "" ? (
                <span className="text-xs text-zinc-400">Empty</span>
              ) : (
                <CustomerTraitValue value={traits[key]} expandJSON />
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
