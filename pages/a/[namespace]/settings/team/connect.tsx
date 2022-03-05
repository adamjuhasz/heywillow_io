import { ReactElement, useContext, useState } from "react";
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
import ToastContext from "components/Toast";
import Loading from "components/Loading";
import { RequestBody, ResponseBody } from "pages/api/v1/inbox/create";

export default function ConnectInbox(): JSX.Element {
  const teamId = useGetTeamId();
  const { data: inboxes, mutate } = useGetInboxes(teamId);
  const [emailAddress, setEmailAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const { addToast } = useContext(ToastContext);

  return (
    <>
      <Head>
        <title>Connect Email</title>
      </Head>

      <SettingsHeader />
      <SettingsTitle>Team settings</SettingsTitle>

      <AppContainer className=" mt-14 flex ">
        <TeamSettingsSidebar />

        <div className="grow space-y-6">
          <SettingsBox
            title="Connect email account"
            explainer="Connect your teams shared inbox. This is the account at which you receive customer support emails."
            button={loading ? <Loading className="h-4 w-4" /> : "Connect"}
            disabled={loading}
            onSubmit={async () => {
              setLoading(true);
              try {
                if (teamId === undefined) {
                  throw new Error("no team id");
                }
                addToast({
                  type: "active",
                  string: "Adding inbox, this may take 5 - 10 sec",
                });
                const body: RequestBody = {
                  emailAddress: emailAddress,
                  teamId: teamId,
                };
                const res = await fetch("/api/v1/inbox/create", {
                  method: "POST",
                  headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(body),
                });

                switch (res.status) {
                  case 200:
                    break;

                  default:
                    console.error(res);
                    throw new Error(`Status is ${res.status}`);
                }

                const responseBody: ResponseBody = await res.json();
                console.log(responseBody);
                await mutate();
              } catch (e) {
                console.error(e);
                addToast({ type: "error", string: "Error connecting email" });
              } finally {
                setLoading(false);
              }
            }}
          >
            <div className="text-sm">Email address</div>
            <input
              id="EmailAddress"
              name="EmailAddress"
              type="email"
              autoComplete="email"
              value={emailAddress}
              onChange={(e) => setEmailAddress(e.target.value)}
              required
              className="block w-72 appearance-none rounded-md border border-zinc-600 bg-zinc-900 px-3 py-2 placeholder-zinc-500 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 disabled:cursor-not-allowed sm:text-sm"
              placeholder="hi@stealth.ai"
            />
          </SettingsBox>

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

ConnectInbox.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
