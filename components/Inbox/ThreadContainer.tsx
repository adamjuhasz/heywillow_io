import { Fragment, useEffect, useRef } from "react";
import { Menu, Transition } from "@headlessui/react";
import { DotsVerticalIcon } from "@heroicons/react/solid";

import Message from "./Message";
import Input from "./Input";
import { SupabaseMessage } from "hooks/useGetMessages";

interface Props {
  subject: string;
  scrollToBottom?: boolean;
  status: string;
  sender: string;
  submit: (_t: string) => Promise<void>;
  threadId: number;
  messages: SupabaseMessage[];
}

export default function ThreadContainer(props: Props) {
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current === null || props.scrollToBottom !== true) {
      return;
    }
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [props.messages, props.scrollToBottom]);

  return (
    <div className="min-h-0 flex-1 overflow-y-auto">
      <div className="bg-white pt-5 pb-6 shadow">
        <div className="px-4 sm:flex sm:items-baseline sm:justify-between sm:px-6 lg:px-8">
          <div className="sm:w-0 sm:flex-1">
            <h1
              id="message-heading"
              className="text-lg font-medium text-gray-900"
            >
              {props.subject}
            </h1>
            <p className="mt-1 truncate text-sm text-gray-500">
              {props.sender}
            </p>
          </div>

          <div className="mt-4 flex items-center justify-between sm:mt-0 sm:ml-6 sm:flex-shrink-0 sm:justify-start">
            <span className="inline-flex items-center rounded-full bg-cyan-100 px-3 py-0.5 text-sm font-medium text-cyan-800">
              {props.status}
            </span>
            <Menu as="div" className="relative ml-3 inline-block text-left">
              <div>
                <Menu.Button className="-my-2 flex items-center rounded-full bg-white p-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-600">
                  <span className="sr-only">Open options</span>
                  <DotsVerticalIcon className="h-5 w-5" aria-hidden="true" />
                </Menu.Button>
              </div>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          type="button"
                          className={[
                            active
                              ? "bg-gray-100 text-gray-900"
                              : "text-gray-700",
                            "flex w-full justify-between px-4 py-2 text-sm",
                          ].join(" ")}
                        >
                          <span>Copy email address</span>
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          href="#"
                          className={[
                            active
                              ? "bg-gray-100 text-gray-900"
                              : "text-gray-700",
                            "flex justify-between px-4 py-2 text-sm",
                          ].join(" ")}
                        >
                          <span>Previous conversations</span>
                        </a>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          href="#"
                          className={[
                            active
                              ? "bg-gray-100 text-gray-900"
                              : "text-gray-700",
                            "flex justify-between px-4 py-2 text-sm",
                          ].join(" ")}
                        >
                          <span>View original</span>
                        </a>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>
      </div>
      {/* Thread section*/}
      <ul role="list" className="space-y-2 py-4 sm:space-y-4 sm:px-6 lg:px-8">
        {props.messages.map(({ messages }) => (
          <Message
            key={messages.id}
            id={BigInt(messages.id)}
            createdAt={new Date(messages.created_at)}
            type={"email"}
            direction={"incoming"}
            emailMessageId={null}
            internalMessageId={null}
            threadId={BigInt(1)}
            aliasId={null}
            teamMemberId={null}
            AliasEmail={null}
            InternalMessage={null}
            EmailMessage={{
              id: BigInt(messages.id),
              createdAt: new Date(messages.created_at),
              from: messages.from,
              to: "",
              sourceMessageId: "",
              emailMessageId: "",
              subject: messages.subject,
              body: messages.body_text,
              raw: {},
            }}
            teamId={null}
            Comment={[]}
          />
        ))}
        {props.messages.length === 0 ? <div>Loading...</div> : <></>}
        <Input ref={messagesEndRef} submit={props.submit} />
      </ul>
    </div>
  );
}
