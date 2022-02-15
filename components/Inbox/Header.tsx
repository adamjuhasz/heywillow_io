import { Fragment, useState } from "react";
import { Dialog, Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon, SearchIcon } from "@heroicons/react/solid";
import { BellIcon, MenuIcon, XIcon } from "@heroicons/react/outline";
import Link from "next/link";

import { user } from "../../data/ExampleData/user";
import { navigation } from "../../data/ExampleData/navigation";
import { userNavigation } from "../../data/ExampleData/usernav";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="relative flex h-16 flex-shrink-0 items-center bg-white">
      {/* Logo area */}
      <div className="absolute inset-y-0 left-0 lg:static lg:flex-shrink-0">
        <Link href="/app/dashboard">
          <a className="flex h-16 w-16 items-center justify-center bg-cyan-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-600 lg:w-20">
            <img
              className="h-8 w-auto"
              src="https://tailwindui.com/img/logos/workflow-mark.svg?color=white"
              alt="Workflow"
            />
          </a>
        </Link>
      </div>

      {/* Picker area */}
      <div className="mx-auto lg:hidden">
        <div className="relative">
          <label htmlFor="inbox-select" className="sr-only">
            Choose inbox
          </label>
          <select
            id="inbox-select"
            className="rounded-md border-0 bg-none pl-3 pr-8 text-base font-medium text-gray-900 focus:ring-2 focus:ring-blue-600"
          >
            <option value="/open">Open</option>
            <option value="/archived">Archived</option>
            <option value="/assigned">Assigned</option>
            <option value="/flagged">Flagged</option>
            <option value="/spam">Spam</option>
            <option value="/drafts">Drafts</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center justify-center pr-2">
            <ChevronDownIcon
              className="h-5 w-5 text-gray-500"
              aria-hidden="true"
            />
          </div>
        </div>
      </div>

      {/* Menu button area */}
      <div className="absolute inset-y-0 right-0 flex items-center pr-4 sm:pr-6 lg:hidden">
        {/* Mobile menu button */}
        <button
          type="button"
          className="-mr-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-600"
          onClick={() => setOpen(true)}
        >
          <span className="sr-only">Open main menu</span>
          <MenuIcon className="block h-6 w-6" aria-hidden="true" />
        </button>
      </div>

      {/* Desktop nav area */}
      <div className="hidden lg:flex lg:min-w-0 lg:flex-1 lg:items-center lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className="relative max-w-2xl text-gray-400 focus-within:text-gray-500">
            <label htmlFor="desktop-search" className="sr-only">
              Search all inboxes
            </label>
            <input
              id="desktop-search"
              type="search"
              placeholder="Search all inboxes"
              className="block w-full border-transparent pl-12 placeholder-gray-500 focus:border-transparent focus:ring-0 sm:text-sm"
            />
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center justify-center pl-4">
              <SearchIcon className="h-5 w-5" aria-hidden="true" />
            </div>
          </div>
        </div>
        <div className="ml-10 flex flex-shrink-0 items-center space-x-10 pr-4">
          <nav aria-label="Global" className="flex space-x-10">
            {navigation.map((item) =>
              item.children.length ? (
                <Menu as="div" key={item.name} className="relative text-left">
                  <Menu.Button className="flex items-center rounded-md text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2">
                    <span>{item.name}</span>
                    <ChevronDownIcon
                      className="ml-1 h-5 w-5 text-gray-500"
                      aria-hidden="true"
                    />
                  </Menu.Button>

                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-30 mt-2 w-40 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <div className="py-1">
                        {item.children.map((child) => (
                          <Menu.Item key={child.name}>
                            {({ active }) => (
                              <a
                                href={child.href}
                                className={[
                                  active ? "bg-gray-100" : "",
                                  "block px-4 py-2 text-sm text-gray-700",
                                ].join(" ")}
                              >
                                {child.name}
                              </a>
                            )}
                          </Menu.Item>
                        ))}
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>
              ) : (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-sm font-medium text-gray-900"
                >
                  {item.name}
                </a>
              )
            )}
          </nav>
          <div className="flex items-center space-x-8">
            <span className="inline-flex">
              <a
                href="#"
                className="-mx-1 rounded-full bg-white p-1 text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">View notifications</span>
                <BellIcon className="h-6 w-6" aria-hidden="true" />
              </a>
            </span>

            <Menu as="div" className="relative inline-block text-left">
              <Menu.Button className="flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2">
                <span className="sr-only">Open user menu</span>
                <img
                  className="h-8 w-8 rounded-full"
                  src={user.imageUrl}
                  alt=""
                />
              </Menu.Button>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 z-30 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          href="#"
                          className={[
                            active ? "bg-gray-100" : "",
                            "block px-4 py-2 text-sm text-gray-700",
                          ].join(" ")}
                        >
                          Your Profile
                        </a>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <Link href="/logout">
                          <a
                            className={[
                              active ? "bg-gray-100" : "",
                              "block px-4 py-2 text-sm text-gray-700",
                            ].join(" ")}
                          >
                            Sign Out
                          </a>
                        </Link>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide this `div` based on menu open/closed state */}
      <Transition.Root show={open} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-40 lg:hidden"
          onClose={setOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="hidden sm:fixed sm:inset-0 sm:block sm:bg-gray-600 sm:bg-opacity-75" />
          </Transition.Child>

          <Transition.Child
            as={Fragment}
            enter="transition ease-out duration-150 sm:ease-in-out sm:duration-300"
            enterFrom="transform opacity-0 scale-110 sm:translate-x-full sm:scale-100 sm:opacity-100"
            enterTo="transform opacity-100 scale-100 sm:translate-x-0 sm:scale-100 sm:opacity-100"
            leave="transition ease-in duration-150 sm:ease-in-out sm:duration-300"
            leaveFrom="transform opacity-100 scale-100 sm:translate-x-0 sm:scale-100 sm:opacity-100"
            leaveTo="transform opacity-0 scale-110 sm:translate-x-full sm:scale-100 sm:opacity-100"
          >
            <nav
              className="fixed inset-0 z-40 h-full w-full bg-white sm:inset-y-0 sm:left-auto sm:right-0 sm:w-full sm:max-w-sm sm:shadow-lg"
              aria-label="Global"
            >
              <div className="flex h-16 items-center justify-between px-4 sm:px-6">
                <a href="#">
                  <img
                    className="block h-8 w-auto"
                    src="https://tailwindui.com/img/logos/workflow-mark.svg?color=cyan&shade=400"
                    alt="Workflow"
                  />
                </a>
                <button
                  type="button"
                  className="-mr-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-600"
                  onClick={() => setOpen(false)}
                >
                  <span className="sr-only">Close main menu</span>
                  <XIcon className="block h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              <div className="max-w-8xl mx-auto mt-2 px-4 sm:px-6">
                <div className="relative text-gray-400 focus-within:text-gray-500">
                  <label htmlFor="mobile-search" className="sr-only">
                    Search all inboxes
                  </label>
                  <input
                    id="mobile-search"
                    type="search"
                    placeholder="Search all inboxes"
                    className="block w-full rounded-md border-gray-300 pl-10 placeholder-gray-500 focus:border-blue-600 focus:ring-blue-600"
                  />
                  <div className="absolute inset-y-0 left-0 flex items-center justify-center pl-3">
                    <SearchIcon className="h-5 w-5" aria-hidden="true" />
                  </div>
                </div>
              </div>
              <div className="max-w-8xl mx-auto py-3 px-2 sm:px-4">
                {navigation.map((item) => (
                  <Fragment key={item.name}>
                    <a
                      href={item.href}
                      className="block rounded-md py-2 px-3 text-base font-medium text-gray-900 hover:bg-gray-100"
                    >
                      {item.name}
                    </a>
                    {item.children.map((child) => (
                      <a
                        key={child.name}
                        href={child.href}
                        className="block rounded-md py-2 pl-5 pr-3 text-base font-medium text-gray-500 hover:bg-gray-100"
                      >
                        {child.name}
                      </a>
                    ))}
                  </Fragment>
                ))}
              </div>
              <div className="border-t border-gray-200 pt-4 pb-3">
                <div className="max-w-8xl mx-auto flex items-center px-4 sm:px-6">
                  <div className="flex-shrink-0">
                    <img
                      className="h-10 w-10 rounded-full"
                      src={user.imageUrl}
                      alt=""
                    />
                  </div>
                  <div className="ml-3 min-w-0 flex-1">
                    <div className="truncate text-base font-medium text-gray-800">
                      {user.name}
                    </div>
                    <div className="truncate text-sm font-medium text-gray-500">
                      {user.email}
                    </div>
                  </div>
                  <a
                    href="#"
                    className="ml-auto flex-shrink-0 bg-white p-2 text-gray-400 hover:text-gray-500"
                  >
                    <span className="sr-only">View notifications</span>
                    <BellIcon className="h-6 w-6" aria-hidden="true" />
                  </a>
                </div>
                <div className="max-w-8xl mx-auto mt-3 space-y-1 px-2 sm:px-4">
                  {userNavigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="block rounded-md py-2 px-3 text-base font-medium text-gray-900 hover:bg-gray-50"
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
              </div>
            </nav>
          </Transition.Child>
        </Dialog>
      </Transition.Root>
    </header>
  );
}
