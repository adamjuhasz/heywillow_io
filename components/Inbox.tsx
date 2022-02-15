import { threads } from "../data/ExampleData/threads";
import Header from "./Inbox/Header";
import Sidebar from "./Inbox/Sidebar";
import Threads from "./Inbox/ThreadList";

export type Messages = typeof threads[number];

export interface Props {
  messages: Messages[];
}

export const loader = async (): Promise<Props> => {
  return { messages: threads };
};

type ServerProps = Awaited<ReturnType<typeof loader>>;

interface ActionProps {
  selectMessage: (_msg: Messages) => void;
}

interface DynamicProps {
  messageView: React.ReactNode;
}

export default function Inbox(props: ServerProps & ActionProps & DynamicProps) {
  return (
    <>
      <div className="absolute top-0 left-0 flex h-full w-full flex-col">
        {/* Top nav*/}
        <Header />

        {/* Bottom section */}
        <div className="flex min-h-0 flex-1 overflow-hidden">
          {/* Narrow sidebar*/}
          <Sidebar />

          {/* Main area */}
          <main className="min-w-0 flex-1 border-t border-gray-200 xl:flex">
            <section
              aria-labelledby="message-heading"
              className="hidden h-full min-w-0 flex-1 flex-col overflow-hidden xl:order-last xl:flex"
            >
              {/* Top section */}
              <div className="flex-shrink-0 border-b border-gray-200 bg-white">
                {/* Toolbar*/}
              </div>

              {props.messageView}
            </section>

            {/* Message list*/}
            <aside className="order-first block flex-shrink-0">
              <Threads
                messages={props.messages}
                selectMessage={props.selectMessage}
              />
            </aside>
          </main>
        </div>
      </div>
    </>
  );
}
