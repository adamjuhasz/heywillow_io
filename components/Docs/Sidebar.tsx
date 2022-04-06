import { useRouter } from "next/router";
import Link from "next/link";

export default function DocsSidebar() {
  const router = useRouter();

  const basicClasses =
    "block text-zinc-400 rounded-r-xl px-4 mr-4 py-1 hover:text-zinc-100";
  const activeClasses = "text-sky-500 bg-sky-300 bg-opacity-10";

  return (
    <>
      <h2 className="mx-2 border-zinc-600 px-2 py-2 text-3xl">
        <Link href="/">
          <a className="hover:underline">Willow</a>
        </Link>{" "}
        <Link href="/docs">
          <a className="font-mono text-sky-500 hover:underline">API</a>
        </Link>
      </h2>

      <div className="">
        <Link href={{ pathname: "/docs/v1/introduction" }}>
          <a
            className={[
              basicClasses,
              router.pathname === "/docs/v1/introduction" ? activeClasses : "",
            ].join(" ")}
          >
            Introduction
          </a>
        </Link>
        <Link href={{ pathname: "/docs/v1/authentication" }}>
          <a
            className={[
              basicClasses,
              router.pathname === "/docs/v1/authentication"
                ? activeClasses
                : "",
            ].join(" ")}
          >
            Authentication
          </a>
        </Link>
        <Link href={{ pathname: "/docs/v1/customers" }}>
          <a
            className={[
              basicClasses,
              router.pathname === "/docs/v1/customers" ? activeClasses : "",
            ].join(" ")}
          >
            Customers
          </a>
        </Link>
      </div>

      <div className="">
        <h3 className={"px-4 text-lg"}>Customer</h3>
        <Link href={{ pathname: "/docs/v1/record/event" }}>
          <a
            className={[
              basicClasses,
              router.pathname === "/docs/v1/record/event" ? activeClasses : "",
            ].join(" ")}
          >
            Event recording
          </a>
        </Link>
        <Link href={{ pathname: "/docs/v1/record/trait" }}>
          <a
            className={[
              basicClasses,
              router.pathname === "/docs/v1/record/trait" ? activeClasses : "",
            ].join(" ")}
          >
            Trait recording
          </a>
        </Link>
      </div>
    </>
  );
}
