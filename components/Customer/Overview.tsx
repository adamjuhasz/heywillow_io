import Head from "next/head";
import type { Prisma } from "@prisma/client";
import isString from "lodash/isString";

import AppContainer from "components/App/Container";
import CustomerTraitTable from "components/Customer/traits/TraitTable";
import CustomerThreadBox from "components/Customer/ThreadBox";
import CustomerJourneyBox from "components/Customer/Journey";
import CustomerHeader from "components/Customer/Header";

interface MiniTrait {
  key: string;
  value: Prisma.JsonValue;
}

interface MiniEvents {
  id: number;
  action: string;
  createdAt: string;
}

interface MiniThread {
  id: number;
  Message: { subject: null | string }[];
  createdAt: string;
}

interface Props {
  id: number;
  userId: string;
  traits: MiniTrait[];
  events: MiniEvents[];
  threads: MiniThread[] | undefined;
  prefixPath: string;
}

export default function CustomerOverview(props: Props): JSX.Element {
  const traits = props.traits.reduce((acc, { key, value }) => {
    acc[key] = value;
    return acc;
  }, {} as Record<string, Prisma.JsonValue>);

  const name: string = isString(traits.name)
    ? traits.name
    : `${traits.firstName || ""} ${traits.lastName || ""}`.trim();

  return (
    <>
      <Head>
        <title>{name !== "" ? `${name} on Willow` : "Willow"}</title>
      </Head>

      <div className="w-full border-b border-b-zinc-700 bg-black">
        <AppContainer>
          <CustomerHeader
            id={props.id}
            userId={props.userId}
            traits={props.traits}
          />
        </AppContainer>
      </div>

      <AppContainer>
        <div className="flex pt-7 pb-7">
          <div className="relative w-1/2">
            <CustomerTraitTable traits={props.traits} />
          </div>

          <div className="flex w-1/2 flex-col px-2">
            <CustomerThreadBox
              threads={props.threads}
              prefixPath={props.prefixPath}
            />

            <div className="h-7" />

            <CustomerJourneyBox events={props.events} />
          </div>
        </div>
      </AppContainer>
    </>
  );
}
