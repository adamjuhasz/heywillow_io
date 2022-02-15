import useGetThreads from "hooks/useGetThreads";
export default function Threads(): JSX.Element {
  const threads = useGetThreads();

  return (
    <ul
      role="list"
      className="grid grid-cols-1 gap-6 p-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
    >
      {threads.map((thread) => (
        <li
          key={thread.id}
          className="col-span-1 flex flex-col divide-y divide-gray-200 rounded-lg bg-white text-center shadow"
        >
          <div className="flex flex-1 flex-col p-8">
            <img
              className="mx-auto h-32 w-32 flex-shrink-0 rounded-full"
              src={`https://thispersondoesnotexist.com/image?r=${
                Math.random() % 100
              }+${thread.id}`}
              alt=""
            />
            <h3 className="mt-6 text-sm font-medium text-gray-900">
              {thread.sender}
            </h3>
            <dl className="mt-1 flex flex-grow flex-col justify-between">
              <dt className="sr-only">Title</dt>
              <dd className="text-sm text-gray-500">{thread.datetime}</dd>
              <dt className="sr-only">Role</dt>
              <dd className="mt-3">
                <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                  open
                </span>
              </dd>
            </dl>
            <dl className="mt-1 flex flex-grow flex-col justify-start">
              <dt className="sr-only">Preview</dt>
              <dd className="truncate text-sm text-gray-500">
                {thread.preview}
              </dd>
            </dl>
          </div>

          <div>
            <div className="-mt-px flex divide-x divide-gray-200">
              {/* <div className="w-0 flex-1 flex">
                <a
                  href={`mailto:${thread.sender}`}
                  className="relative -mr-px w-0 flex-1 inline-flex items-center justify-center py-4 text-sm text-gray-700 font-medium border border-transparent rounded-bl-lg hover:text-gray-500"
                >
                  <MailIcon className="w-5 h-5 text-gray-400" aria-hidden="true" />
                  <span className="ml-3">Email</span>
                </a>
              </div> */}
              {/* <div className="-ml-px w-0 flex-1 flex">
                <a
                  href={`tel:${person.telephone}`}
                  className="relative w-0 flex-1 inline-flex items-center justify-center py-4 text-sm text-gray-700 font-medium border border-transparent rounded-br-lg hover:text-gray-500"
                >
                  <PhoneIcon className="w-5 h-5 text-gray-400" aria-hidden="true" />
                  <span className="ml-3">Call</span>
                </a>
              </div> */}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
