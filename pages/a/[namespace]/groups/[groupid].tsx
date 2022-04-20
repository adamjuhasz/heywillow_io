import { ReactElement } from "react";
import { useRouter } from "next/router";

import AppLayout from "layouts/app";

import Feed from "components/Thread/Feed";
import ThreeColumnLayout from "components/Thread/ThreeColumnLayout";
import AppHeader from "components/App/HeaderHOC";
import WorkspaceHeader from "components/App/WorkspaceHeader";
import {
  eventToFeed,
  sortFeed,
  traitToFeed,
} from "components/Thread/Feed/convert";
import { CustomerTraitNode } from "components/Thread/Feed/Types";
import getNameFromTraits from "shared/traits/getName";

import useGetGroup from "client/getGroup";

export default function Group() {
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

  const customers = group?.Customer || [];
  const names: Record<number, string | undefined> = {};
  customers.forEach((c) => {
    const name = getNameFromTraits(c.CustomerTrait);

    names[c.id] = name;
  });
  const customerEvents = customers.flatMap((c) =>
    c.CustomerEvent.map((e) => ({
      ...eventToFeed(e),
      displayName: names[c.id] || `${c.userId}`,
    }))
  );

  const sorted = sortFeed([...traits, ...events, ...customerEvents]);

  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader>
        <WorkspaceHeader />
      </AppHeader>

      <div className="relative grow">
        <ThreeColumnLayout
          topOffset="top-24"
          leftSidebar={<></>}
          rightSidebar={
            <div className="flex flex-col">
              {customers.map((c) => (
                <div key={c.id}>{c.id}</div>
              ))}
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
        </ThreeColumnLayout>
      </div>
    </div>
  );
}
Group.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
