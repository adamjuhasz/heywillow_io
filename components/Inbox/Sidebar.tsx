import Link from "next/link";
import { sidebarNavigation } from "../../data/ExampleData/sidebar";

export default function Sidebar() {
  return (
    <nav
      aria-label="Sidebar"
      className="hidden lg:block lg:flex-shrink-0 lg:overflow-y-auto lg:bg-gray-800"
    >
      <div className="relative flex w-20 flex-col space-y-3 p-3">
        {sidebarNavigation.map((item) => (
          <Link href={item.href} key={item.name}>
            <a
              className={[
                item.current
                  ? "bg-gray-900 text-white"
                  : "text-gray-400 hover:bg-gray-700",
                "inline-flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-lg",
              ].join(" ")}
            >
              <span className="sr-only">{item.name}</span>
              <item.icon className="h-6 w-6" aria-hidden="true" />
            </a>
          </Link>
        ))}
      </div>
    </nav>
  );
}
