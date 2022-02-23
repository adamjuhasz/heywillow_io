import { ReactElement } from "react";
import Head from "next/head";
import type { NotificationChannel, NotificationType } from "@prisma/client";
import { keys } from "lodash";
import { Switch } from "@headlessui/react";

import AppLayout from "layouts/app";
import SettingsHeader from "components/Settings/Header";
import SettingsTitle from "components/Settings/Title";
import AppContainer from "components/App/Container";
import SettingsSidebar from "components/Settings/Sidebar";
import useGetNotificationPreferences from "client/getNotificationPreferences";
import useChangeNotificationPreference from "client/changeNotificationPreference";
import useGetMyTeamMemberId from "client/getMyTeamMemberId";
import useGetTeamId from "client/getTeamId";

export default function NotificationSettingsPage(): JSX.Element {
  const { data: preferences, mutate } = useGetNotificationPreferences();
  const changePref = useChangeNotificationPreference();
  const teamId = useGetTeamId();
  const { data: teamMemberId } = useGetMyTeamMemberId(teamId);

  const channelName: Record<NotificationChannel, string> = {
    InApp: "In app",
    Email: "Email",
  };

  const preferenceList: {
    type: NotificationType;
    title: string;
    description: string;
    channels: Record<NotificationChannel, boolean>;
  }[] = [
    {
      type: "ThreadNew",
      title: "New thread",
      description: "Get notified when a new thread is created",
      channels: { InApp: true, Email: true },
    },
  ];

  return (
    <>
      <Head>
        <title>Notification Preferences</title>
      </Head>

      <SettingsHeader />
      <SettingsTitle>Notification Preferences</SettingsTitle>

      <AppContainer className="my-14 flex">
        <SettingsSidebar />

        <div className="grow space-y-6">
          {preferenceList.map((currentElement) => (
            <div
              key={currentElement.type}
              className="flex min-h-[3rem] w-full flex-col rounded-md border border-zinc-600 px-6 py-6"
            >
              <div className="flex w-full flex-col">
                <div className="">{currentElement.title}</div>
                <div className="text-sm text-zinc-400">
                  {currentElement.description}
                </div>
              </div>
              <div className="my-4 h-[1px] w-full bg-zinc-600" />
              {(keys(currentElement.channels) as NotificationChannel[]).map(
                (channel) => {
                  const currentSetting =
                    preferences?.find(
                      (serverPref) =>
                        serverPref.type === currentElement.type &&
                        serverPref.channel === channel
                    )?.enabled || currentElement.channels[channel];
                  return (
                    <div
                      key={channel}
                      className="my-1 flex w-full flex-row items-center justify-between text-sm"
                    >
                      <div>{channelName[channel]}</div>
                      <div>
                        <Switch
                          disabled={preferences === undefined}
                          checked={currentSetting}
                          onChange={async (value) => {
                            if (teamMemberId?.id === undefined) {
                              alert("Can't find your team member ID");
                              return;
                            }

                            await changePref({
                              channel: channel,
                              enabled: value,
                              teamMemberId: teamMemberId.id,
                              type: currentElement.type,
                            });
                            mutate();
                          }}
                          className={`${
                            currentSetting ? "bg-blue-500" : "bg-zinc-700"
                          }
          relative inline-flex h-5 w-10 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
                        >
                          <span className="sr-only">Use setting</span>
                          <span
                            aria-hidden="true"
                            className={`${
                              currentSetting
                                ? "translate-x-[1.25rem]"
                                : "translate-x-0"
                            }
            pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
                          />
                        </Switch>
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          ))}
        </div>
      </AppContainer>
    </>
  );
}

NotificationSettingsPage.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
