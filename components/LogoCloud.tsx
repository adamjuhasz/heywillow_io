import Image from "next/image";

import Copper from "public/Copper-Logo.png";
import Embedded from "public/Embedded-Logo.png";
import Empower from "public/Empower-Logo.png";
import Prizeout from "public/Prizeout-Logo.png";
import Truehold from "public/Truehold-Logo.png";

export default function LogoCloud(): JSX.Element {
  return (
    <div className="bg-gray-100">
      <div className="mx-auto max-w-7xl py-16 px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm font-semibold uppercase tracking-wide text-gray-500">
          Trusted by these amazing companies
        </p>
        <div className="mt-6 grid grid-cols-2 gap-8 md:grid-cols-6 lg:grid-cols-5">
          <div className="col-span-1 flex justify-center md:col-span-2 lg:col-span-1">
            <Image
              className="h-12 opacity-50 grayscale-[50]"
              src={Copper}
              alt="Copper"
            />
          </div>
          <div className="col-span-1 flex justify-center md:col-span-2 lg:col-span-1">
            <Image
              className="h-12 opacity-50 grayscale-[50]"
              src={Embedded}
              alt="Embedded"
            />
          </div>
          <div className="col-span-1 flex justify-center md:col-span-2 lg:col-span-1">
            <Image
              className="h-12 opacity-50 grayscale-[50]"
              src={Empower}
              alt="Empower"
            />
          </div>
          <div className="col-span-1 flex justify-center md:col-span-2 md:col-start-2 lg:col-span-1">
            <Image
              className="h-12 opacity-50 grayscale-[50]"
              src={Prizeout}
              alt="Prizeout"
            />
          </div>
          <div className="col-span-2 flex justify-center md:col-span-2 md:col-start-4 lg:col-span-1">
            <Image
              className="h-12 opacity-50 grayscale-[50]"
              src={Truehold}
              alt="Truehold"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
