import { ClockIcon } from "@heroicons/react/solid";
import Avatar from "components/Avatar";
import Link from "next/link";
import { formatDistanceToNowStrict } from "date-fns";
import { useRouter } from "next/router";

import unwrapRFC2822 from "shared/rfc2822unwrap";
import applyMaybe from "shared/applyMaybe";

interface MiniAlias {
  emailAddress: string;
}

interface MiniGmail {
  emailAddress: string;
}

interface MiniThread {
  id: number;
  aliasEmailId: number;
  createdAt: string;
}

interface MiniMessage {
  text: { text: string }[];
  subject: null | string;
}

export type FetchResponse = MiniThread & {
  AliasEmail: MiniAlias;
  GmailInbox: MiniGmail;
  Message: MiniMessage[];
};

interface Props {
  threads: FetchResponse[] | undefined;
}

export default function DashboardTableTop(props: Props) {
  return (
    <div className="my-14 grid grid-cols-3 gap-x-4 gap-y-4">
      {props.threads === undefined ? (
        <></>
      ) : (
        props.threads.map((t) => <Card key={t.id} t={t} />)
      )}
    </div>
  );
}

function Card({ t }: { t: FetchResponse }) {
  const router = useRouter();

  const lastMessage = t.Message.reverse()[0];

  const unwrappedBody = applyMaybe(
    unwrapRFC2822,
    lastMessage.text.map((txt) => txt.text).join("\r\n\r\n")
  );

  const preview = unwrappedBody || "";
  return (
    <Link
      href={{
        pathname: "/a/[namespace]/thread/[threadid]",
        query: { ...router.query, threadid: t.id },
      }}
    >
      <a>
        <div className="col-span-1 flex h-full flex-col rounded-xl border border-zinc-600 bg-black p-6 text-sm font-light text-zinc-200 hover:border-zinc-100 hover:shadow-lg hover:shadow-black">
          <div className="flex items-center">
            <div className="flex items-center truncate">
              <Avatar
                str={`${t.aliasEmailId}`}
                className="mr-2 h-8 w-8 shrink-0"
              />
              <div className="flex flex-col truncate">
                <div className="truncate font-normal text-zinc-100">
                  {t.AliasEmail.emailAddress}
                </div>
                <div className="truncate text-xs text-zinc-500">
                  {t.GmailInbox.emailAddress}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 truncate font-medium text-zinc-100 line-clamp-1">
            {t.Message[0].subject || ""}
          </div>
          <div className="mt-1 mb-4 text-zinc-400 line-clamp-2">{preview}</div>

          <div className="flex items-center text-zinc-500">
            <ClockIcon className="h-3 w-3" />
            <div className="ml-22">
              {formatDistanceToNowStrict(new Date(t.createdAt))}
            </div>
          </div>
        </div>
      </a>
    </Link>
  );
}
