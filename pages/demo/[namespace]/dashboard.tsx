import AppHeader from "components/App/Header";
import DashboardTableTop, {
  FetchResponse,
} from "components/Dashboard/TableTop";
import LinkBar, { Link } from "components/Settings/LinkBar";

export default function DemoDashboard() {
  const demo: FetchResponse[] = [
    {
      id: 1,
      aliasEmailId: 1,
      AliasEmail: { emailAddress: "ajuhasz@gmail.com" },
      GmailInbox: { emailAddress: "hi@paytgthr.com" },
      Message: [
        {
          EmailMessage: { body: "need help", subject: "right now" },
          InternalMessage: null,
        },
      ],
    },
    {
      id: 2,
      aliasEmailId: 2,
      AliasEmail: { emailAddress: "customer@gmail.com" },
      GmailInbox: { emailAddress: "hi@paytgthr.com" },
      Message: [
        {
          EmailMessage: { body: "need help", subject: "right now" },
          InternalMessage: null,
        },
      ],
    },
    {
      id: 3,
      aliasEmailId: 3,
      AliasEmail: { emailAddress: "acust@gmail.com" },
      GmailInbox: { emailAddress: "hi@paytgthr.com" },
      Message: [
        {
          EmailMessage: { body: "need help", subject: "right now" },
          InternalMessage: null,
        },
      ],
    },
    {
      id: 4,
      aliasEmailId: 4,
      AliasEmail: { emailAddress: "helpneeded1@gmail.com" },
      GmailInbox: { emailAddress: "hi@paytgthr.com" },
      Message: [
        {
          EmailMessage: { body: "need help", subject: "right now" },
          InternalMessage: null,
        },
      ],
    },
  ];
  return (
    <>
      <AppHeader
        teams={[
          { name: "Pay Tgthr", namespace: "paytgthr" },
          { name: "Willow", namespace: "willow" },
        ]}
        activeTeam="willow"
      >
        <LinkBar hideBorder>
          <Link href="/demo/dashboard">
            <div className="flex items-center">
              Threads
              <div className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-xs text-white">
                1
              </div>
            </div>
          </Link>
          <Link href="/demo/activity">
            <div className="flex items-center">
              Activity
              <div className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-yellow-500 text-xs text-white">
                12
              </div>
            </div>
          </Link>
        </LinkBar>
      </AppHeader>

      <div className="mx-auto mt-14 max-w-4xl">
        <DashboardTableTop threads={demo} />
      </div>
    </>
  );
}
