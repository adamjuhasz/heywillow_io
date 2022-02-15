import { useEffect } from "react";
import { useSupabase } from "components/UserContext";
import { useRouter } from "next/router";
import Image from "next/image";

import logo from "public/SqLogo.svg";
import image from "public/images/architecture/photo-1505904267569-f02eaeb45a4c.jpg";

export default function Login(): JSX.Element {
  const client = useSupabase();
  const router = useRouter();

  useEffect(() => {
    client?.auth.signOut().then((res) => {
      console.log(res);
      router.push("/");
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className=" absolute top-0 left-0 flex h-full w-full">
        <div className="flex flex-1 flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
          <div className="mx-auto w-full max-w-sm lg:w-96">
            <div>
              <Image
                className="h-12 w-auto"
                src={logo}
                alt="Willow"
                width={48}
                height={48}
                layout="fixed"
              />
              <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                Logged out
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
