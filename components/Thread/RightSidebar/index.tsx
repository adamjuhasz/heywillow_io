import { Dispatch, SetStateAction } from "react";
import { UrlObject } from "url";

import ChangeThreadState from "components/Thread/RightSidebar/ChangeState";
import ThreadActions from "components/Thread/RightSidebar/Actions";
import ThreadList from "components/Thread/RightSidebar/ThreadList";
import AliasInfo from "components/Thread/RightSidebar/Alias/AliasInfo";
import changeThreadState from "client/changeThreadState";

export interface RightSidebarAlias {
  aliasName: string;
  emailAddress: string;
  createdAt: string;
}

export interface RightSidebarThread {
  id: number;
  createdAt: string;
  Message: {
    AliasEmail: null | RightSidebarAlias;
  }[];
}

interface MiniThread {
  id: number;
  createdAt: string;
  Message: { subject: string | null }[];
}

interface Props {
  scrollToID: (id: string) => void;
  loading: boolean;
  threadNum: number | undefined;
  setLoading: Dispatch<SetStateAction<boolean>>;
  href: UrlObject | string;
  thread: RightSidebarThread | undefined;
  threads: MiniThread[] | undefined;
  changeThreadState: typeof changeThreadState;
  threadLink: string | undefined;
}

export default function RightSidebar(props: Props) {
  const customerEmail = props.thread?.Message.filter(
    (m) => m.AliasEmail !== null
  )[0]?.AliasEmail?.emailAddress;

  const customerCreatedAt = props.thread?.Message.filter(
    (m) => m.AliasEmail !== null
  )[0]?.AliasEmail?.createdAt;

  return (
    <div className="flex min-h-[100px] flex-col rounded-md px-2 py-2">
      <AliasInfo customerEmail={customerEmail} createdAt={customerCreatedAt} />

      <ThreadList threads={props.threads} scrollToID={props.scrollToID} />

      <ThreadActions threadLink={props.threadLink} />

      <ChangeThreadState
        loading={props.loading}
        setLoading={props.setLoading}
        threadNum={props.threadNum}
        href={props.href}
        changeThreadState={props.changeThreadState}
      />
    </div>
  );
}
