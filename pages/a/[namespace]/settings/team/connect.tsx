import {
  Dispatch,
  Fragment,
  ReactElement,
  SetStateAction,
  useContext,
  useState,
} from "react";
import Head from "next/head";
import formatDistanceToNowStrict from "date-fns/formatDistanceToNowStrict";
import defaultTo from "lodash/defaultTo";
import CheckCircleIcon from "@heroicons/react/solid/CheckCircleIcon";
import ClipboardCopyIcon from "@heroicons/react/solid/ClipboardCopyIcon";
import ExternalLinkIcon from "@heroicons/react/solid/ExternalLinkIcon";
import MinusCircleIcon from "@heroicons/react/solid/MinusCircleIcon";
import Link from "next/link";
import isError from "lodash/isError";

import AppLayout from "layouts/app";
import SettingsHeader from "components/Settings/Header";
import SettingsTitle from "components/Settings/Title";
import TeamSettingsSidebar from "components/Settings/Team/TeamSidebar";
import SettingsBox from "components/Settings/Box/Box";
import useGetCurrentTeam from "client/getTeamId";
import useGetInboxes from "client/getInboxes";
import Avatar from "components/Avatar";
import AppContainer from "components/App/Container";
import ToastContext from "components/Toast";
import Loading from "components/Loading";
import useGetDomain from "client/getDomains";
import type { SupabaseInbox } from "types/supabase";
import type { PostmarkResponse } from "pages/api/v1/domain/get";
import useGetTeams from "client/getTeams";
import verifyDNS from "client/verifyDNSSettings";
import createInbox, { BadRequest } from "client/createInbox";

type Tabs = "Inboxes" | "Domains";

export default function ConnectInbox(): JSX.Element {
  const currentTeam = useGetCurrentTeam();
  const teamId = currentTeam?.currentTeamId;

  const { data: inboxes, mutate: mutateInboxes } = useGetInboxes(teamId);

  const [emailAddress, setEmailAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const { addToast } = useContext(ToastContext);
  const [currentTab, setTab] = useState<Tabs>("Inboxes");
  const { data: domains, mutate: mutateDomains } = useGetDomain(teamId);

  const { data: teams } = useGetTeams();

  const thisTeam = (teams || []).find((t) => t.id === teamId);

  const justDomains: PostmarkResponse[] = defaultTo(domains, []).reduce(
    (acc, d) => (d.status === "fulfilled" ? [...acc, d.value] : acc),
    [] as PostmarkResponse[]
  );
  const domainsNeedVerify: PostmarkResponse[] = justDomains.filter(
    (d) => d.DKIMVerified === false || d.ReturnPathDomainVerified === false
  );

  return (
    <>
      <Head>
        <title>Connect Email</title>
      </Head>

      <SettingsHeader />
      <SettingsTitle>Team settings</SettingsTitle>

      <AppContainer className="flex flex-col sm:mt-14 sm:flex-row">
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

                await createInbox(teamId, emailAddress);

                setEmailAddress("");
              } catch (e) {
                if (e instanceof BadRequest) {
                  console.error("400 error from server", e.errorCode, e);
                  switch (e.errorCode) {
                    case 503:
                      addToast({
                        type: "error",
                        string: `The email needs to be on your own domain (ex: "stealth.com)`,
                      });
                      break;

                    default:
                      addToast({ type: "error", string: e.message });
                  }
                } else if (isError(e)) {
                  console.error(e);
                  addToast({ type: "error", string: e.message });
                } else {
                  console.error(e);
                  addToast({ type: "error", string: "Please try again" });
                }
              } finally {
                setLoading(false);
                setTimeout(async () => {
                  // wait XXXms for supabase to catch up
                  void mutateDomains();
                  void mutateInboxes();
                }, 200);
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
            <div
              className={[
                "box-border flex h-9 w-full items-center justify-start space-x-4  px-4 lg:px-0",
                "border-b border-zinc-600",
              ].join(" ")}
            >
              <button
                onClick={() => setTab("Inboxes")}
                className={[
                  "flex h-9 items-center hover:text-zinc-100",
                  currentTab === "Inboxes"
                    ? "box-content border-b-2 border-zinc-100 font-normal text-zinc-100"
                    : "font-light text-zinc-500",
                ].join(" ")}
              >
                Connected accounts
              </button>

              <button
                onClick={() => setTab("Domains")}
                className={[
                  "flex h-9 items-center hover:text-zinc-100",
                  currentTab === "Domains"
                    ? "box-content border-b-2 border-zinc-100 font-normal text-zinc-100"
                    : "font-light text-zinc-500",
                ].join(" ")}
              >
                <div className="flex items-center">
                  <div>Domains</div>
                  {domains && domainsNeedVerify.length > 0 ? (
                    <div className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-xs text-zinc-100">
                      <div className="-ml-[1px] mt-[2px]">
                        {domainsNeedVerify.length}
                      </div>
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
              </button>
            </div>
            {currentTab === "Inboxes" &&
            inboxes !== undefined &&
            inboxes.length > 0 &&
            thisTeam !== undefined ? (
              <InboxViewer
                inboxes={inboxes}
                namespace={thisTeam.Namespace.namespace}
              />
            ) : currentTab === "Domains" &&
              domains !== undefined &&
              domains.length > 0 ? (
              <DomainViewer
                domains={justDomains}
                loading={loading}
                setLoading={setLoading}
                mutateDomains={mutateDomains}
              />
            ) : (
              <></>
            )}
          </div>
        </div>
      </AppContainer>
    </>
  );
}

ConnectInbox.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};

interface InboxProps {
  inboxes: SupabaseInbox[];
  namespace: string;
}

function InboxViewer({ inboxes, namespace }: InboxProps) {
  const { addToast } = useContext(ToastContext);

  return (
    <div className="mt-4 rounded-md border border-zinc-600 bg-black">
      {(inboxes || []).map((i, idx) => {
        const forwardEmail = `${namespace}+${i.id}@inbound.heywillow.io`;

        return (
          <Fragment key={i.id}>
            {idx === 0 ? (
              <></>
            ) : (
              <div
                key={`${idx}-border`}
                className="h-[1px] w-full bg-zinc-600"
              />
            )}
            <div
              key={i.id}
              className="flex h-16 items-center justify-between p-4"
            >
              <div className="flex items-center">
                <Avatar str={i.emailAddress} className="mr-2 h-8 w-8" />
                <div className="flex flex-col">
                  <div className="text-sm font-light">{i.emailAddress}</div>
                  <div className="text-xs font-normal text-zinc-500">
                    forward emails to:{" "}
                    <button
                      className="inline hover:text-zinc-100"
                      onClick={async () => {
                        await navigator.clipboard.writeText(forwardEmail);
                        addToast({
                          type: "string",
                          string: "Email address copied to clipboard",
                        });
                      }}
                    >
                      {forwardEmail}{" "}
                      <ClipboardCopyIcon className="-mt-0.5 inline h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Fragment>
        );
      })}
    </div>
  );
}

interface DomainProps {
  domains: PostmarkResponse[];
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
  mutateDomains: () => void;
}

function DomainViewer({
  domains,
  loading,
  setLoading,
  mutateDomains,
}: DomainProps) {
  const { addToast } = useContext(ToastContext);

  return (
    <div className="mt-4 rounded-md border border-zinc-600 bg-black text-zinc-400">
      {/* eslint-disable-next-line sonarjs/cognitive-complexity */}
      {(domains || []).map((d, idx) => {
        const dkimHostname =
          d.DKIMPendingHost !== "" ? d.DKIMPendingHost : d.DKIMHost;
        const dkimValue =
          d.DKIMPendingTextValue !== ""
            ? d.DKIMPendingTextValue
            : d.DKIMTextValue;

        return (
          <Fragment key={d.ID}>
            {idx === 0 ? (
              <></>
            ) : (
              <div
                key={`${idx}-border`}
                className="h-[1px] w-full bg-zinc-600"
              />
            )}
            <div key={d.ID} className="min-h-16 flex flex-col  p-4">
              <div className="flex items-center">
                <Avatar str={`${d.ID}`} className="mr-2 h-8 w-8" />
                <div className="flex flex-col">
                  <div className="text-sm font-light">{d.domain}</div>
                  <div className="text-xs font-normal text-zinc-500">
                    Created{" "}
                    {formatDistanceToNowStrict(new Date(d.createdAt), {
                      addSuffix: true,
                    })}
                  </div>
                </div>
              </div>

              <div className="mb-0 mt-4 text-lg font-medium text-zinc-100">
                DNS Settings
              </div>

              <div className="mt-2 flex items-center justify-between border-t-[1px] border-zinc-800 pt-2">
                <div className="flex w-full flex-col">
                  <div className="mb-1 flex items-center justify-between">
                    <div className="text-zinc-100">
                      Return path{" "}
                      <span className="ml-2 rounded-full bg-blue-500 px-2 py-0.5 text-xs text-white">
                        Required
                      </span>
                    </div>

                    <div>
                      <Link href="https://postmarkapp.com/support/article/1090-resources-for-adding-dkim-and-return-path-records-to-dns-for-common-hosts-and-dns-providers">
                        <a
                          target="_blank"
                          className="text-xs text-zinc-400 hover:text-zinc-100 hover:underline"
                        >
                          Help{" "}
                          <ExternalLinkIcon className="-mt-0.5 inline h-3 w-3" />
                        </a>
                      </Link>
                    </div>
                  </div>

                  <button
                    className="flex items-center text-xs hover:text-zinc-100"
                    onClick={async () => {
                      await navigator.clipboard.writeText(d.ReturnPathDomain);
                      addToast({
                        type: "string",
                        string: "Return path hostname copied to clipboard",
                      });
                    }}
                  >
                    <span className="text-zinc-100">Hostname</span>:{" "}
                    {d.ReturnPathDomain}{" "}
                    <ClipboardCopyIcon className="ml-1 h-4 w-4" />
                  </button>

                  <button
                    className="flex items-center text-xs hover:text-zinc-100"
                    onClick={async () => {
                      await navigator.clipboard.writeText("CNAME");
                      addToast({
                        type: "string",
                        string: "Return path DNS type copied to clipboard",
                      });
                    }}
                  >
                    <span className="text-zinc-100">Type</span>: CNAME{" "}
                    <ClipboardCopyIcon className="ml-1 h-4 w-4" />
                  </button>

                  <button
                    className="flex break-all text-left text-xs hover:text-zinc-100"
                    onClick={async () => {
                      await navigator.clipboard.writeText(
                        d.ReturnPathDomainCNAMEValue
                      );
                      addToast({
                        type: "string",
                        string: "Return path CNAME value copied to clipboard",
                      });
                    }}
                  >
                    <span className="text-zinc-100">Value</span>:{" "}
                    {d.ReturnPathDomainCNAMEValue}{" "}
                    <ClipboardCopyIcon className="ml-1 h-4 w-4 shrink-0" />
                  </button>
                </div>

                <div className="ml-7 text-sm">
                  {d.ReturnPathDomainVerified ? (
                    <CheckCircleIcon className="h-5 w-5 text-lime-500" />
                  ) : (
                    <div className="flex items-center ">
                      <MinusCircleIcon className="h-5 w-5 text-red-500" />
                      <button
                        disabled={loading}
                        className="ml-1 rounded-md border border-zinc-600 px-2 py-1 text-xs hover:border-transparent hover:bg-white hover:text-zinc-900"
                        onClick={async () => {
                          setLoading(true);
                          try {
                            await verifyDNS(d.domain, "ReturnPath");
                            mutateDomains();
                          } catch (e) {
                            addToast({
                              type: "error",
                              string: "Could not run verification",
                            });
                            console.error(e);
                          } finally {
                            setLoading(false);
                          }
                        }}
                      >
                        {loading ? (
                          <div className="flex items-center">
                            &nbsp;
                            <Loading className="h-3 w-3" />
                            &nbsp;
                          </div>
                        ) : (
                          "Verify"
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-2 flex items-center justify-between border-t-[1px] border-zinc-800 pt-2">
                <div className="flex w-full flex-col">
                  <div className="mb-1 flex items-center justify-between">
                    <div className="text-zinc-100">
                      DKIM{" "}
                      <span className="ml-2 rounded-full bg-blue-500 px-2 py-0.5 text-xs text-white">
                        Required
                      </span>
                    </div>
                    <div>
                      <Link href="https://postmarkapp.com/support/article/1090-resources-for-adding-dkim-and-return-path-records-to-dns-for-common-hosts-and-dns-providers">
                        <a
                          target="_blank"
                          className="text-xs text-zinc-400 hover:text-zinc-100 hover:underline"
                        >
                          Help{" "}
                          <ExternalLinkIcon className="-mt-0.5 inline h-3 w-3" />
                        </a>
                      </Link>
                    </div>
                  </div>

                  <button
                    className="flex items-center text-xs hover:text-zinc-100"
                    onClick={async () => {
                      await navigator.clipboard.writeText(dkimHostname);
                      addToast({
                        type: "string",
                        string: "DKIM hostname copied to clipboard",
                      });
                    }}
                  >
                    <span className="text-zinc-100">Hostname</span>:{" "}
                    {dkimHostname}{" "}
                    <ClipboardCopyIcon className="ml-1 h-4 w-4" />
                  </button>

                  <button
                    className="flex break-all text-left text-xs hover:text-zinc-100"
                    onClick={async () => {
                      await navigator.clipboard.writeText("TXT");
                      addToast({
                        type: "string",
                        string: "DKIM DNS type copied to clipboard",
                      });
                    }}
                  >
                    <span className="text-zinc-100">Type</span>: TXT{" "}
                    <ClipboardCopyIcon className="ml-1 h-4 w-4 shrink-0" />
                  </button>

                  <button
                    className="flex text-left text-xs hover:text-zinc-100"
                    onClick={async () => {
                      await navigator.clipboard.writeText(dkimValue);
                      addToast({
                        type: "string",
                        string: "DKIM value copied to clipboard",
                      });
                    }}
                  >
                    <span className="text-zinc-100">Value</span>:{" "}
                    <span className="break-all">{dkimValue}</span>{" "}
                    <ClipboardCopyIcon className="ml-1 h-4 w-4 shrink-0" />
                  </button>
                </div>

                <div className="ml-7 text-sm">
                  {d.DKIMVerified ? (
                    <CheckCircleIcon className="h-5 w-5 text-lime-500" />
                  ) : (
                    <div className="flex items-center ">
                      <MinusCircleIcon className="h-5 w-5 text-red-500" />
                      <button
                        className="ml-1 rounded-md border border-zinc-600 px-2 py-1 text-xs hover:border-transparent hover:bg-white hover:text-zinc-900"
                        onClick={async () => {
                          setLoading(true);
                          try {
                            await verifyDNS(d.domain, "DKIM");
                            mutateDomains();
                          } catch (e) {
                            addToast({
                              type: "error",
                              string: "Could not run verification",
                            });
                            console.error(e);
                          } finally {
                            setLoading(false);
                          }
                        }}
                      >
                        {loading ? (
                          <div className="flex items-center">
                            &nbsp;
                            <Loading className="h-3 w-3" />
                            &nbsp;
                          </div>
                        ) : (
                          "Verify"
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Fragment>
        );
      })}
    </div>
  );
}
