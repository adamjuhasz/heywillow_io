import Image from "next/image";
import { ReactElement } from "react";

import AppLayout from "layouts/app";
import GetAuthCookie from "components/GetAuthCoookie";

import image from "public/images/nature/john-towner-JgOeRuGD_Y4-unsplash.jpg";

export default function AuthPage(): JSX.Element {
  return (
    <>
      <GetAuthCookie redirect="/a/workspace" timeout />
      <div className=" absolute top-0 left-0 flex h-full w-full">
        <div className="flex flex-1 flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
          <div className="mx-auto flex w-full max-w-sm items-center justify-center lg:w-96">
            <svg
              className="-ml-1 mr-3 h-5 w-5 animate-spin text-black"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
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

AuthPage.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
