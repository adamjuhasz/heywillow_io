import { Fragment, Key, ReactElement } from "react";

import AppLayout from "layouts/app";
import Message from "components/Thread/Message";
import DateSep from "components/Inbox/DateSeperator";
import ActionBox from "components/Inbox/ActionBox";
import messages from "data/Demo/Threads";

export default function DemoThread() {
  return (
    <>
      <ul
        role="list"
        className="flex flex-col space-y-2 py-4 px-4 sm:space-y-4 sm:px-6 lg:px-8"
      >
        {messages.map((message, idx) => {
          let content = <></>;
          let key: Key = `${idx}`;
          switch (message.type) {
            case "Message":
              key = `message-${message.message.id}`;
              content = <Message {...message.message} teamId={0} />;
              break;

            case "Date":
              key = `date-${message.date}`;
              content = <DateSep date={message.date} />;
              break;

            case "Action":
              content = <ActionBox actions={message.actions} />;
              break;
          }

          return <Fragment key={key}>{content}</Fragment>;
        })}
      </ul>
    </>
  );
}

DemoThread.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
