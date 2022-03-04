import { MailIcon } from "@heroicons/react/solid";
import Link from "next/link";
import Image from "next/image";

import {
  SupabaseAliasEmail,
  SupabaseMessage,
  SupabaseThread,
  SupabaseThreadState,
} from "types/supabase";

export type FetchThread = SupabaseThread & {
  ThreadState: SupabaseThreadState[];
  Message: (SupabaseMessage & {
    text: { text: string }[];
    subject: null | string;
    AliasEmail: SupabaseAliasEmail;
  })[];
};

interface Props {
  threads: FetchThread[];
}

export default function ThreadList(props: Props) {
  return (
    <ul
      role="list"
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
    >
      {props.threads.map((thread) => (
        <li
          key={`${thread.id}`}
          className="col-span-1 flex flex-col divide-y divide-gray-200 rounded-lg bg-white text-center shadow"
        >
          <div className="flex flex-1 flex-col p-8">
            <Image
              className="mx-auto h-32 w-32 flex-shrink-0 rounded-full"
              src={
                "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60"
              }
              alt=""
              layout="fill"
            />
            <h3 className="mt-6 text-sm font-medium text-gray-900">
              {thread.Message[0].AliasEmail.emailAddress}
            </h3>
            <dl className="mt-1 flex flex-grow flex-col justify-between">
              <dt className="sr-only">Title</dt>
              <dd className="text-sm text-gray-500">
                {thread.Message.reverse()[0].subject || ""}
              </dd>
              <dt className="sr-only">Count</dt>
              <dd className="text-sm text-gray-500">
                {thread.Message.length} messages in thread
              </dd>
              <dt className="sr-only">Sall text</dt>
              <dd className="text-sm text-gray-500">
                {thread.Message.reverse()[0]
                  .text.map((t) => t.text)
                  .join("\n")
                  .slice(0, 50)}
              </dd>
              <dt className="sr-only">Role</dt>
              <dd className="mt-3">
                <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                  Thread {thread.id}
                </span>
              </dd>
            </dl>
          </div>
          <div>
            <div className="-mt-px flex divide-x divide-gray-200">
              <div className="flex w-0 flex-1">
                <Link href={`/a/thread/${thread.id}`}>
                  <a className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center rounded-bl-lg border border-transparent py-4 text-sm font-medium text-gray-700 hover:text-gray-500">
                    <MailIcon
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                    <span className="ml-3">Open Thread</span>
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
