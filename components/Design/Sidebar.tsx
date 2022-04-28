import { Disclosure } from "@headlessui/react";
import { ChevronRightIcon } from "@heroicons/react/solid";
import Link from "next/link";

export default function DesignSidebar() {
  return (
    <>
      <Disclosure defaultOpen>
        {({ open }) => (
          <>
            <Disclosure.Button className="flex items-center py-2">
              <ChevronRightIcon
                className={[
                  "h-5 w-5 text-sm transition",
                  open ? " rotate-90" : "",
                ].join(" ")}
              />
              Components
            </Disclosure.Button>

            <Disclosure.Panel className="">
              <ul className="ml-2.5 space-y-1 border-l-2 border-zinc-600 pl-2.5 text-sm text-zinc-300">
                <li>
                  <Link href={{ pathname: "/design/button" }}>
                    <a>Button</a>
                  </Link>
                </li>
                <li>
                  <Link href={{ pathname: "/design/capacity" }}>
                    <a>Capacity</a>
                  </Link>
                </li>
                <li>
                  <Link href={{ pathname: "/design/fieldset" }}>
                    <a>Fieldset</a>
                  </Link>
                </li>
              </ul>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </>
  );
}
