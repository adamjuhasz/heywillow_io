import Head from "next/head";
import { PlusCircleIcon } from "@heroicons/react/outline";
import { useState } from "react";

import AppHeader from "components/App/Header";
import SettingsTitle from "components/Settings/Title";
import TeamSettingsSidebar from "components/Settings/Team/Sidebar";
import LinkBar, { Link } from "components/Settings/LinkBar";

export default function ConnectGmailInbox(): JSX.Element {
  const [emailCount, setEmailCount] = useState(1);
  const [emails, setEmails] = useState([""]);

  return (
    <>
      <Head>
        <title>Invite Team Members</title>
      </Head>
      <AppHeader />
      <SettingsTitle>Team settings</SettingsTitle>

      <div className="mx-auto my-14 flex max-w-4xl">
        <TeamSettingsSidebar />

        <div className="grow space-y-6">
          <div className="text-2xl">Members</div>
          <div className="text-normal font-light text-zinc-500">
            Manage and invite team members
          </div>

          <form className="flex flex-col rounded-md border border-zinc-600 bg-zinc-800 bg-opacity-30 p-4">
            <div className="flex items-center justify-between">
              <div className="">Add new</div>
            </div>
            <div className="my-4 h-[1px] bg-zinc-300 bg-opacity-25" />
            <div className="text-sm font-light text-zinc-400">
              Invite team members
            </div>
            <div className="mt-4">
              <label
                htmlFor="email"
                className="block text-xs font-light uppercase text-zinc-400"
              >
                Email address
              </label>
              {new Array(emailCount).fill(null).map((_, idx) => (
                <div className="mt-2" key={idx}>
                  <input
                    value={emails[idx] || ""}
                    onChange={(e) => {
                      const newEmails = [...emails];
                      newEmails[idx] = e.target.value;
                      setEmails(newEmails);
                    }}
                    id="email"
                    name="email"
                    type="email"
                    placeholder="jane@stealth.ai"
                    className="block w-full max-w-full appearance-none rounded-md border border-zinc-600 bg-zinc-900 px-3 py-2 text-xs font-light placeholder-gray-400 shadow-sm placeholder:text-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => {
                const newCount = emailCount + 1;
                setEmailCount(newCount);
                setEmails(
                  Array(newCount)
                    .fill("")
                    .map((_, idx) => emails[idx] || "")
                );
              }}
              className="mt-4 flex w-fit items-center rounded-md border border-zinc-600 px-3 py-1.5 text-sm text-zinc-400 hover:border-zinc-100 hover:text-zinc-100"
            >
              <PlusCircleIcon className="mr-1.5 h-4 w-4" /> Add more
            </button>
            <div className="my-4 h-[1px] bg-zinc-300 bg-opacity-25" />

            <div className="flex w-full items-center justify-end">
              <button
                type="submit"
                className="min-w-[80px] rounded-md border border-transparent bg-blue-500 py-1.5 px-3 text-sm font-normal text-white hover:border-zinc-100 hover:bg-transparent hover:text-zinc-100 disabled:cursor-not-allowed disabled:border-zinc-500 disabled:bg-transparent disabled:font-light disabled:text-zinc-500"
              >
                Send invites
              </button>
            </div>
          </form>

          <div className="flex w-full flex-col">
            <LinkBar>
              <Link exact href="/app/settings/team/invite">
                Team members
              </Link>
              <Link href="/app/settings/team/invite/pending">
                Pending invitations
              </Link>
            </LinkBar>

            <div className="mt-4 h-60 w-full rounded-md border border-zinc-600 bg-zinc-800 bg-opacity-30" />
          </div>
        </div>
      </div>
    </>
  );
}
