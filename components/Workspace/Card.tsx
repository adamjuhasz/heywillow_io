import ClockIcon from "@heroicons/react/solid/ClockIcon";
import Avatar from "components/Avatar";
import Link from "next/link";
import formatDistanceToNowStrict from "date-fns/formatDistanceToNowStrict";
import { useRouter } from "next/router";

import { ParagraphElement } from "types/slate";
import slateToText from "shared/slate/slateToText";

interface MiniAlias {
  emailAddress: string;
  aliasName: string | null;
}

interface MiniInbox {
  emailAddress: string;
}

interface MiniThread {
  id: number;
  aliasEmailId: number;
  createdAt: string;
}

interface MiniMessage {
  text: ParagraphElement[];
  subject: null | string;
}

export type FetchResponse = MiniThread & {
  AliasEmail: MiniAlias;
  Inbox: MiniInbox;
  Message: MiniMessage[];
};

interface CardProps {
  t: FetchResponse;
  prefix: string;
}

export default function Card({ t, prefix }: CardProps) {
  const router = useRouter();

  const lastMessage = t.Message.reverse()[0];

  const preview: string = slateToText(lastMessage.text).join("\n");

  return (
    <Link
      href={{
        pathname: "/[prefix]/[namespace]/thread/[threadid]",
        query: { ...router.query, threadid: t.id, prefix: prefix },
      }}
      prefetch={true}
    >
      <a>
        <div className="col-span-1 flex h-full flex-col rounded-xl border border-zinc-600 bg-black p-6 text-sm font-light text-zinc-200 hover:border-zinc-100 hover:shadow-lg hover:shadow-black">
          <div className="flex items-center">
            <div className="flex items-center truncate">
              <Avatar
                str={`${t.AliasEmail.emailAddress}`}
                className="mr-2 h-8 w-8 shrink-0"
              />
              <div className="flex flex-col truncate">
                <div
                  className={[
                    "truncate font-normal",
                    t.AliasEmail.aliasName ? "text-zinc-400" : "text-zinc-100", //for the ellipses coloring
                  ].join(" ")}
                >
                  <span className="text-zinc-100">
                    {t.AliasEmail.aliasName || t.AliasEmail.emailAddress}
                  </span>
                  {t.AliasEmail.aliasName ? (
                    <span className="text-xs text-zinc-400">{` (${t.AliasEmail.emailAddress})`}</span>
                  ) : (
                    ""
                  )}
                </div>
                <div className="truncate text-xs text-zinc-500">
                  {t.Inbox.emailAddress}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 truncate font-medium text-zinc-100 line-clamp-1">
            {t.Message[0].subject || ""}
          </div>
          <div className="mt-1 mb-4 text-zinc-400 line-clamp-2">{preview}</div>

          <div className="flex items-center text-zinc-500">
            <ClockIcon className="mr-1 -mt-0.5 h-3 w-3" />
            <div className="">
              {formatDistanceToNowStrict(new Date(t.createdAt))}
            </div>
          </div>
        </div>
      </a>
    </Link>
  );
}
