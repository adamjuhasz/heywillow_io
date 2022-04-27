import Avatar from "components/Avatar";
import { Switch } from "@headlessui/react";

import useGetCustomer from "client/getCustomer";

import getNameFromTraits from "shared/traits/getName";
import getSpecificTrait from "shared/traits/getSpecificTrait";

interface Props {
  customer: number;
  enabled: boolean;
  setEnabled: (state: boolean) => void;
}
export default function CustomerMiniBox(props: Props) {
  const { data: customer } = useGetCustomer(props.customer);

  const name =
    getNameFromTraits(customer?.CustomerTrait || []) || customer?.userId;
  const uniqueId =
    getSpecificTrait("email", customer?.CustomerTrait || []) ||
    `${props.customer}`;

  return (
    <div className="my-1 flex w-full flex-col">
      <div className="flex w-full justify-between">
        <div className="flex items-center">
          <Avatar str={uniqueId} className="mr-1 h-6 w-6 shrink-0" />
          <div className="line-clamp-1">{name}</div>
        </div>
        <div>
          <Switch
            checked={props.enabled}
            onChange={props.setEnabled}
            className="group relative inline-flex h-5 w-10 flex-shrink-0 cursor-pointer items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <span className="sr-only">Use setting</span>
            <span
              aria-hidden="true"
              className="pointer-events-none absolute h-full w-full rounded-md bg-transparent"
            />
            <span
              aria-hidden="true"
              className={[
                props.enabled ? "bg-blue-600" : "bg-black",
                "pointer-events-none absolute mx-auto h-4 w-9 rounded-full transition-colors duration-200 ease-in-out",
              ].join(" ")}
            />
            <span
              aria-hidden="true"
              className={[
                props.enabled ? "translate-x-5" : "translate-x-0",
                "pointer-events-none absolute left-0 inline-block h-5 w-5 transform rounded-full border border-zinc-900 bg-zinc-100 shadow ring-0 transition-transform duration-200 ease-in-out",
              ].join(" ")}
            />
          </Switch>
        </div>
      </div>
    </div>
  );
}
