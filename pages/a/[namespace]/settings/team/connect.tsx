import { ReactElement } from "react";
import Head from "next/head";
import { formatDistanceToNowStrict } from "date-fns";

import AppLayout from "layouts/app";
import SettingsHeader from "components/Settings/Header";
import SettingsTitle from "components/Settings/Title";
import TeamSettingsSidebar from "components/Settings/Team/TeamSidebar";
import SettingsBox from "components/Settings/Box/Box";
import useGetTeamId from "client/getTeamId";
import useGetInboxes from "client/getInboxes";
import LinkBar, { Link } from "components/Settings/LinkBar";
import Avatar from "components/Avatar";
import AppContainer from "components/App/Container";

export default function ConnectGmailInbox(): JSX.Element {
  const teamId = useGetTeamId();
  const { data: inboxes } = useGetInboxes(teamId);

  return (
    <>
      <Head>
        <title>Connect Gmail</title>
      </Head>

      <SettingsHeader />
      <SettingsTitle>Team settings</SettingsTitle>

      <AppContainer className=" mt-14 flex ">
        <TeamSettingsSidebar />

        <div className="grow space-y-6">
          <SettingsBox
            title="Connect Gmail account"
            explainer="Connect your teams shared inbox. This is the account at which you receive customer support emails."
            button="Connect"
            warning={
              <div>
                <div className="inline-flex items-center justify-center rounded-full bg-yellow-500 px-2 py-0.5 text-black">
                  beta
                </div>{" "}
                During our beta we&apos;ll need to whitelist your gmail, email
                it to{" "}
                <a
                  className=" text-zinc-100 underline decoration-2 underline-offset-4"
                  href="mailto:help@heywillow.io"
                >
                  help@heywillow.io
                </a>
              </div>
            }
            onSubmit={() => {
              alert("Noop now");
            }}
          />

          <div className="flex w-full flex-col">
            <LinkBar>
              <Link exact href="/a/[namespace]/settings/team/connect">
                Connected accounts
              </Link>
            </LinkBar>

            <div className="mt-4 rounded-md border border-zinc-600 bg-black">
              {(inboxes || []).map((i, idx) => (
                <>
                  {idx === 0 ? (
                    <></>
                  ) : (
                    <div className="h-[1px] w-full bg-zinc-600" />
                  )}
                  <div
                    key={i.id}
                    className="flex h-16 items-center justify-between p-4"
                  >
                    <div className="flex items-center">
                      <Avatar str={i.emailAddress} className="mr-2 h-8 w-8" />
                      <div className="flex flex-col">
                        <div className="text-sm font-light">
                          {i.emailAddress}
                        </div>
                        <div className="text-xs font-normal text-zinc-500">
                          Created{" "}
                          {formatDistanceToNowStrict(new Date(i.createdAt), {
                            addSuffix: true,
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ))}
            </div>
          </div>
        </div>
      </AppContainer>
    </>
  );
}

ConnectGmailInbox.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
