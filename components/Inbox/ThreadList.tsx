import { formatDistanceToNowStrict } from "date-fns";

import { threads } from "../../data/ExampleData/threads";

export type Threads = typeof threads[number];

export interface Props {
  messages: Threads[];
  selectMessage: (_msg: Threads) => void;
}

export default function ThreadList(props: Props) {
  return (
    <div className="relative flex h-full w-full flex-col border-r border-gray-200 bg-gray-100 xl:w-96">
      <div className="flex-shrink-0">
        <div className="flex h-16 flex-col justify-center bg-white px-6">
          <div className="flex items-baseline space-x-3">
            <h2 className="text-lg font-medium text-gray-900">Inbox</h2>
            <p className="text-sm font-medium text-gray-500">
              {props.messages.length} messages
            </p>
          </div>
        </div>
        <div className="border-t border-b border-gray-200 bg-gray-50 px-6 py-2 text-sm font-medium text-gray-500">
          Sorted by date
        </div>
      </div>
      <nav aria-label="Message list" className="min-h-0 flex-1 overflow-y-auto">
        <ul
          role="list"
          className="divide-y divide-gray-200 border-b border-gray-200"
        >
          {props.messages.map((message) => (
            <li
              key={message.id}
              className="relative bg-white py-5 px-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-600 hover:bg-gray-50"
            >
              <div className="flex justify-between space-x-3">
                <div className="min-w-0 flex-1">
                  <a
                    href={message.href}
                    className="block focus:outline-none"
                    onClick={(e) => {
                      e.preventDefault();
                      props.selectMessage(message);
                    }}
                  >
                    <span className="absolute inset-0" aria-hidden="true" />
                    <p className="truncate text-sm font-medium text-gray-900">
                      {message.sender}
                    </p>
                    <p className="truncate text-sm text-gray-500">
                      {message.subject}
                    </p>
                  </a>
                </div>
                <time
                  dateTime={message.datetime}
                  className="flex-shrink-0 whitespace-nowrap text-sm text-gray-500"
                >
                  {formatDistanceToNowStrict(new Date(message.datetime))} ago
                </time>
              </div>
              <div className="mt-1">
                <p className="text-sm text-gray-600 line-clamp-2">
                  {message.preview}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
