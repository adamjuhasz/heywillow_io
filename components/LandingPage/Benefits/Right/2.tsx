import { LockClosedIcon } from "@heroicons/react/outline";

import Message from "components/Inbox/Message";
import Input from "components/Inbox/Input";

export default function SecureMessaging(): JSX.Element {
  return (
    <div className="lg:mx-auto lg:grid lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-2 lg:gap-24 lg:px-8">
      <div className="mx-auto max-w-xl px-4 sm:px-6 lg:col-start-2 lg:mx-0 lg:max-w-none lg:py-32 lg:px-0">
        <div>
          <div>
            <span className="flex h-12 w-12 items-center justify-center rounded-md bg-gradient-to-r from-purple-600 to-indigo-600">
              <LockClosedIcon
                className="h-6 w-6 text-white"
                aria-hidden="true"
              />
            </span>
          </div>
          <div className="mt-6">
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">
              Secure messaging
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Sometimes a user needs a direct and secure method of sending
              information: uploading ID photos, confirming their SSN, or sending
              in their card number. When email isn&apos;t the right method
              customers can click the secure message and be able to securely
              message or upload files.
            </p>
            <div className="mt-6">
              <a
                href="#"
                className="inline-flex rounded-md border border-transparent bg-gradient-to-r from-purple-600 to-indigo-600 bg-origin-border px-4 py-2 text-base font-medium text-white shadow-sm hover:from-purple-700 hover:to-indigo-700"
              >
                Sign up
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-12 sm:mt-16 lg:col-start-1 lg:mt-0">
        <div className="-ml-48 pr-4 sm:pr-6 md:-ml-16 lg:relative lg:m-0 lg:h-full lg:px-0">
          <div className="pointer-events-none w-full select-none rounded-xl bg-slate-200 shadow-xl ring-1 ring-black ring-opacity-5 lg:absolute lg:right-0 lg:h-full lg:w-[700px] lg:max-w-none">
            <ul
              role="list"
              className="space-y-2 py-4 px-2 sm:space-y-4 sm:px-6 lg:px-8"
            >
              {[
                { id: 1, from: "user@ex.com", body_text: "Email" },
                { id: 2, from: "user@ex.com", body_text: "Email" },
              ].map((item) => (
                <Message
                  key={item.id}
                  id={item.id}
                  createdAt={new Date().toISOString()}
                  type={"email"}
                  direction={"incoming"}
                  emailMessageId={null}
                  internalMessageId={null}
                  threadId={1}
                  aliasId={null}
                  teamMemberId={null}
                  AliasEmail={null}
                  InternalMessage={null}
                  EmailMessage={{
                    id: item.id,
                    createdAt: new Date().toISOString(),
                    from: item.from,
                    to: "",
                    sourceMessageId: "",
                    emailMessageId: "",
                    subject: "",
                    body: item.body_text,
                    raw: {},
                  }}
                  teamId={null}
                  Comment={[]}
                  TeamMember={null}
                  Attachment={[]}
                />
              ))}
              <Input
                defaultValue="I think I entered my SSN in wrong, it's 334-223-443"
                submit={async () => {
                  return;
                }}
              />
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
