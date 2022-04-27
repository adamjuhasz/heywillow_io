import { ReactElement, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import uniq from "lodash/uniq";
import { Switch } from "@headlessui/react";
import groupBy from "lodash/groupBy";
import toPairs from "lodash/toPairs";
import sortBy from "lodash/sortBy";

import AppLayout from "layouts/app";

import Feed from "components/Thread/Feed";
import TwoColumnLayout from "components/Thread/TwoColumnLayout";
import AppHeader from "components/App/HeaderHOC";
import WorkspaceHeader from "components/App/WorkspaceHeader";
import {
  eventToFeed,
  sortFeed,
  traitToFeed,
} from "components/Thread/Feed/convert";
import { CustomerTraitNode } from "components/Thread/Feed/Types";
import AppContainer from "components/App/Container";
import CustomerMiniBox from "components/Group/CustomerMiniBox";

import useGetGroup from "client/getGroup";

import getNameFromTraits from "shared/traits/getName";

export default function Group() {
  const [enabledCustomers, setEnabledCustomers] = useState<number[]>([]);
  const [enableEvents, setEnableEvents] = useState(true);
  const [enableTraits, setEnableTraits] = useState(true);
  const [disabledEvents, setDisabledEvents] = useState<string[]>([]);

  const router = useRouter();
  const { groupid: groupIdString } = router.query; // cspell: disable-line

  const groupId =
    groupIdString === undefined
      ? undefined
      : parseInt(groupIdString as string, 10);

  const { data: group } = useGetGroup(groupId);

  const traits: CustomerTraitNode[] = (group?.CustomerGroupTraits || []).map(
    (t) => ({ ...traitToFeed(t), displayName: "Group" })
  );
  const events = (group?.GroupEvent || []).map((e) => ({
    ...eventToFeed(e),
    displayName: "Group",
  }));

  const customers = useMemo(() => group?.Customer || [], [group]);

  const customerIds = useMemo(() => customers.map((c) => c.id), [customers]);
  const names = useMemo(() => {
    const db: Record<number, string | undefined> = {};
    customers.forEach((c) => {
      const name = getNameFromTraits(c.CustomerTrait);
      db[c.id] = name;
    });

    return db;
  }, [customers]);

  const customerEvents = useMemo(
    () =>
      customers
        .filter((c) => enabledCustomers.includes(c.id))
        .flatMap((c) =>
          c.CustomerEvent.map((e) => ({
            ...eventToFeed(e),
            displayName: names[c.id] || `${c.userId}`,
          }))
        ),
    [customers, enabledCustomers, names]
  );

  const commonEvents: [string, number][] = useMemo(
    () =>
      sortBy(
        toPairs(groupBy(customerEvents, (e) => e.action)),
        (es) => es.length
      ).map(([action, es]) => [action, es.length]),
    [customerEvents]
  );

  const sorted = useMemo(
    () =>
      sortFeed([...traits, ...events, ...customerEvents])
        .filter((node) => (node.type === "event" ? enableEvents : true))
        .filter((node) => (node.type === "traitChange" ? enableTraits : true))
        .filter((node) =>
          node.type === "event" ? !disabledEvents.includes(node.action) : true
        ),
    [traits, events, customerEvents, enableEvents, enableTraits, disabledEvents]
  );

  useEffect(() => {
    setEnabledCustomers(customerIds.sort());
  }, [customerIds]);

  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader>
        <WorkspaceHeader />
      </AppHeader>

      <div className="relative grow">
        <AppContainer>
          <TwoColumnLayout
            topOffset="top-24"
            rightSidebar={
              <div className="flex flex-col">
                {customers.map((c) => (
                  <CustomerMiniBox
                    key={c.id}
                    customer={c.id}
                    enabled={enabledCustomers.includes(c.id)}
                    setEnabled={(enabled: boolean) => {
                      let newCustomerList = enabledCustomers;

                      if (enabled) {
                        newCustomerList = uniq([
                          ...enabledCustomers,
                          c.id,
                        ]).sort();
                      } else {
                        newCustomerList = enabledCustomers.filter(
                          (customer) => c.id !== customer
                        );
                      }

                      setEnabledCustomers(newCustomerList);
                    }}
                  />
                ))}

                <div className="h-12" />

                <div className="flex items-center justify-between">
                  <div>Show events</div>
                  <Switch
                    checked={enableEvents}
                    onChange={setEnableEvents}
                    className="group relative inline-flex h-5 w-10 flex-shrink-0 cursor-pointer items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    <span className="sr-only">Use setting</span>
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute h-full w-full rounded-md bg-transparent"
                    />
                    <span
                      aria-hidden="true"
                      className={[
                        enableEvents ? "bg-blue-600" : "bg-black",
                        "pointer-events-none absolute mx-auto h-4 w-9 rounded-full transition-colors duration-200 ease-in-out",
                      ].join(" ")}
                    />
                    <span
                      aria-hidden="true"
                      className={[
                        enableEvents ? "translate-x-5" : "translate-x-0",
                        "pointer-events-none absolute left-0 inline-block h-5 w-5 transform rounded-full border border-zinc-900 bg-zinc-100 shadow ring-0 transition-transform duration-200 ease-in-out",
                      ].join(" ")}
                    />
                  </Switch>
                </div>

                <div className="flex items-center justify-between">
                  <div>Show trait changes</div>
                  <Switch
                    checked={enableTraits}
                    onChange={setEnableTraits}
                    className="group relative inline-flex h-5 w-10 flex-shrink-0 cursor-pointer items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    <span className="sr-only">Use setting</span>
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute h-full w-full rounded-md bg-transparent"
                    />
                    <span
                      aria-hidden="true"
                      className={[
                        enableTraits ? "bg-blue-600" : "bg-black",
                        "pointer-events-none absolute mx-auto h-4 w-9 rounded-full transition-colors duration-200 ease-in-out",
                      ].join(" ")}
                    />
                    <span
                      aria-hidden="true"
                      className={[
                        enableTraits ? "translate-x-5" : "translate-x-0",
                        "pointer-events-none absolute left-0 inline-block h-5 w-5 transform rounded-full border border-zinc-900 bg-zinc-100 shadow ring-0 transition-transform duration-200 ease-in-out",
                      ].join(" ")}
                    />
                  </Switch>
                </div>

                <div className="h-12" />

                <h2 className="my-1 border-b-2 border-zinc-600 text-xl">
                  Top Events
                </h2>
                <div className="flex flex-col">
                  {commonEvents.slice(0, 10).map((e) => (
                    <div key={e[0]} className="flex justify-between">
                      <div className="line-clamp-1">{e[0]}</div>
                      <Switch
                        checked={!disabledEvents.includes(e[0])}
                        onChange={(enabled) => {
                          if (enabled === false) {
                            setDisabledEvents([...disabledEvents, e[0]]);
                          } else {
                            setDisabledEvents(
                              disabledEvents.filter(
                                (disabled) => disabled !== e[0]
                              )
                            );
                          }
                        }}
                        className="group relative inline-flex h-5 w-10 flex-shrink-0 cursor-pointer items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      >
                        <span className="sr-only">Use setting</span>
                        <span
                          aria-hidden="true"
                          className="pointer-events-none absolute h-full w-full rounded-md bg-transparent"
                        />
                        <span
                          aria-hidden="true"
                          className={[
                            !disabledEvents.includes(e[0])
                              ? "bg-blue-600"
                              : "bg-black",
                            "pointer-events-none absolute mx-auto h-4 w-9 rounded-full transition-colors duration-200 ease-in-out",
                          ].join(" ")}
                        />
                        <span
                          aria-hidden="true"
                          className={[
                            !disabledEvents.includes(e[0])
                              ? "translate-x-5"
                              : "translate-x-0",
                            "pointer-events-none absolute left-0 inline-block h-5 w-5 transform rounded-full border border-zinc-900 bg-zinc-100 shadow ring-0 transition-transform duration-200 ease-in-out",
                          ].join(" ")}
                        />
                      </Switch>
                    </div>
                  ))}
                </div>
              </div>
            }
          >
            <Feed
              feed={sorted}
              addComment={async () => {
                return 0;
              }}
              refreshComment={() => {
                return;
              }}
              teamMemberList={[]}
            />
          </TwoColumnLayout>
        </AppContainer>
      </div>
    </div>
  );
}
Group.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
