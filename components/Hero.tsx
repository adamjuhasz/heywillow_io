import Image from "next/image";
import Link from "next/link";

export default function Hero(): JSX.Element {
  return (
    <div className="relative">
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gray-100" />
      <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="relative shadow-xl sm:overflow-hidden sm:rounded-2xl">
          <div className="absolute inset-0">
            <Image
              className="h-full w-full object-cover"
              src="https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2830&q=80&sat=-100"
              alt="People working on laptops"
              layout="fill"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-purple-800 to-indigo-700 mix-blend-multiply" />
          </div>
          <div className="relative px-4 py-16 sm:px-6 sm:py-24 lg:py-32 lg:px-8">
            <h1 className="mx-auto max-w-4xl text-center text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              <span className=" text-white">Your customer&apos;s </span>
              <span className=" text-lime-200">entire story</span>
              <span className="block text-white"> in one place</span>
            </h1>
            <p className="mx-auto mt-6 max-w-lg text-center text-xl text-lime-200 sm:max-w-3xl">
              See every email they&apos;ve sent you, every drip campaign
              they&apos;ve been in , every newsletter they read, and action
              they&apos;ve taken{" "}
              <span className="underline-offset-3 underline decoration-wavy decoration-2">
                in one continuos flow
              </span>
            </p>
            <div className="mx-auto mt-10 max-w-sm sm:flex sm:max-w-none sm:justify-center">
              <div className="space-y-4 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5 sm:space-y-0">
                <Link href="/login">
                  <a className="flex items-center justify-center rounded-md border border-transparent bg-white px-4 py-3 text-base font-medium text-indigo-700 shadow-sm hover:bg-indigo-50 sm:px-8">
                    Get started
                  </a>
                </Link>
                <Link href="#">
                  <a className="flex items-center justify-center rounded-md border border-transparent bg-indigo-500 bg-opacity-60 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-opacity-70 sm:px-8">
                    Learn more
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
