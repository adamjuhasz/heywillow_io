import { ClockIcon } from "@heroicons/react/solid";
import Avatar from "components/Avatar";
import Link from "next/link";
import { formatDistanceToNowStrict } from "date-fns";

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
  EmailMessage: {
    body: string;
    subject: string;
  } | null;

  InternalMessage: {
    body: string;
  } | null;
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
  const lastMessage = t.Message.reverse()[0];
  const preview =
    lastMessage.EmailMessage?.body || lastMessage.InternalMessage?.body || "";
  return (
    <Link href="/">
      <a>
        <div className="col-span-1 flex flex-col rounded-xl border border-zinc-600 bg-black p-6 text-sm font-light text-zinc-200 hover:border-zinc-100 hover:shadow-lg hover:shadow-black">
          <div className="flex items-center">
            <div className="flex items-center">
              <Avatar str={`${t.aliasEmailId}`} className="mr-2 h-8 w-8" />
              <div className="flex flex-col">
                <div className="truncate font-normal text-zinc-100">
                  {t.AliasEmail.emailAddress}
                </div>
                <div className="truncate text-xs text-zinc-500">
                  {t.GmailInbox.emailAddress}
                </div>
              </div>
            </div>
          </div>

          <div className="my-4 text-zinc-400 line-clamp-2">{preview}</div>

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
