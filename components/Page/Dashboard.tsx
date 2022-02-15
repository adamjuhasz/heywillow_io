import { PropsWithChildren } from "react";

import TeamMemberInfo from "components/Page/TeamMemberInfo";
import RecentThreadList from "components/Threads/RecentList";
import NotificationList from "components/Notifications/List";
import OptionMenu from "components/Page/OptionMenu";

interface Props {
  selected: number | null;
  setSelected: (n: number | null) => void;
}

export default function Dashboard(props: PropsWithChildren<Props>) {
  return (
    <div className="flex h-screen w-screen bg-white">
      <div className="flex h-full w-5/12 flex-col px-10">
        <div className="mt-3 flex h-24 w-full flex-row items-center">
          <TeamMemberInfo />
        </div>
        <div className="mt-10 flex w-full flex-col">
          <RecentThreadList {...props} />
        </div>
        <div className="flex flex-grow flex-col overflow-y-scroll">
          <NotificationList />
        </div>
      </div>
      <div className="relative h-full w-7/12 overflow-scroll bg-sky-50 pl-16">
        <div className=" absolute top-4 right-4 z-50 w-56 text-right">
          <OptionMenu />
        </div>
        {props.children}
      </div>
    </div>
  );
}
