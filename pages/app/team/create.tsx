import Image from "next/image";
import Link from "next/link";

import image from "public/images/architecture/ann-fossa-CmSwG8Jqs48-unsplash.jpg";

export default function CreateTeam(): JSX.Element {
  return (
    <>
      <div className=" absolute top-0 left-0 flex h-full w-full">
        <div className="flex flex-1 flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
          <div className="mx-auto flex w-full max-w-sm items-center justify-center lg:w-96">
            <form action="/api/v1/team/create" method="POST">
              <div className="sm:overflow-hidden">
                <div className="space-y-6 bg-white py-6 px-4 sm:p-6">
                  <div>
                    <h3 className="text-lg font-medium leading-6 text-gray-900">
                      Create team
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      This information will be displayed publicly so be careful
                      what you share.
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-3">
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Team Name
                      </label>
                      <div className="mt-1 flex rounded-md shadow-sm">
                        <input
                          type="text"
                          name="teamName"
                          id="name"
                          required
                          className="block w-full min-w-0 flex-grow rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          placeholder="Supa Company"
                        />
                      </div>
                    </div>

                    {/* <div className="col-span-3 sm:col-span-2">
                    <label
                      htmlFor="domain"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Domain
                    </label>
                    <div className="mt-1 rounded-md shadow-sm flex">
                      <input
                        type="text"
                        name="domain"
                        id="domain"
                        className="focus:ring-indigo-500 focus:border-indigo-500 flex-grow block w-full min-w-0 rounded-md sm:text-sm border-gray-300"
                        placeholder="supacompany.com"
                      />
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      We'll use this to allow members to auto join when their
                      email has this domain
                    </p>
                  </div> */}
                  </div>
                </div>
                <div className="px-4 py-3 text-left sm:px-6">
                  <button
                    type="submit"
                    className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Create team
                  </button>

                  <Link href="/app/team/accept">
                    <a className="ml-2 inline-flex justify-center rounded-md border border-transparent bg-gray-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                      Accept invite
                    </a>
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
        <div className="relative hidden w-0 flex-1 lg:block ">
          <Image
            className="absolute inset-0 h-full w-full object-cover "
            src={image}
            alt="Building zoomed in"
            layout="fill"
            placeholder="blur"
          />
        </div>
      </div>
    </>
  );
}
