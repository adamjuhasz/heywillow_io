export default function EmptyTable() {
  return (
    <div className="mt-8 flex flex-col">
      <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
          <table
            className="min-w-full table-fixed border-separate text-sm"
            style={{ borderSpacing: 0 }}
          >
            <thead className="">
              <tr className="border-0 bg-zinc-800 text-left text-zinc-400">
                <th
                  scope="col"
                  className="rounded-l-md border-t border-l border-b border-r-0 border-zinc-600 p-3"
                >
                  &nbsp;
                </th>
                <th
                  scope="col"
                  className={
                    "border-b border-t border-l-0 border-r-0 border-zinc-600 p-3 "
                  }
                >
                  &nbsp;
                </th>
                <th
                  scope="col"
                  className={
                    "rounded-r-md border-b border-t border-l-0 border-r-0 border-zinc-600 p-3"
                  }
                >
                  &nbsp;
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-600 text-left">
              <tr>
                <td className="border-b border-zinc-600 py-3 px-3">&nbsp;</td>
                <td className="border-b border-zinc-600 py-3 px-3">&nbsp;</td>
                <td className="border-b border-zinc-600 py-3 px-3">&nbsp;</td>
              </tr>
              <tr>
                <td className="border-b border-zinc-600 py-3 px-3">&nbsp;</td>
                <td className="border-b border-zinc-600 py-3 px-3">&nbsp;</td>
                <td className="border-b border-zinc-600 py-3 px-3">&nbsp;</td>
              </tr>
              <tr>
                <td className="border-b border-zinc-600 py-3 px-3">&nbsp;</td>
                <td className="border-b border-zinc-600 py-3 px-3">&nbsp;</td>
                <td className="border-b border-zinc-600 py-3 px-3">&nbsp;</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
