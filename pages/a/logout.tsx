import { ReactElement, useEffect } from "react";
import { useSupabase } from "components/UserContext";
import Image from "next/image";
import WillowLogo from "components/Logo";

import AppLayout from "layouts/app";
import image from "public/images/nature/john-towner-JgOeRuGD_Y4-unsplash.jpg";

export default function LogoutPage(): JSX.Element {
  const client = useSupabase();

  useEffect(() => {
    void client?.auth.signOut().then(async ({ error }) => {
      if (error) {
        console.error(error);
      }

      document.location.assign("/api/v1/auth/logout");
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className=" absolute top-0 left-0 flex h-full w-full">
        <div className="flex flex-1 flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
          <div className="mx-auto w-full max-w-sm lg:w-96">
            <div>
              <WillowLogo className=" h-11 w-11" />
              <h2 className="mt-6 text-3xl font-extrabold text-zinc-100">
                Logging out
              </h2>
            </div>
          </div>
        </div>
        <div className="relative hidden w-0 flex-1 lg:block">
          <Image
            className="absolute inset-0 h-full w-full object-cover"
            src={image}
            alt=""
            layout="fill"
            placeholder="blur"
          />
        </div>
      </div>
    </>
  );
}

LogoutPage.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
