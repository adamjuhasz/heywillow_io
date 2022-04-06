import Link from "next/link";

interface ChangeLog {
  id: string;
  title: string;
}

interface Blog {
  id: string;
  title: string;
}

interface Props {
  changelogs?: ChangeLog[];
  blogs?: Blog[];
}

export default function LandingPageFooter(props: Props) {
  return (
    <div className="flex min-h-[160px] w-full justify-between bg-black px-2 pt-7 pb-14 text-zinc-500 lg:px-0">
      <div className="mx-auto grid w-full max-w-4xl grid-cols-1 space-y-4 px-4 md:grid-cols-6 md:space-y-0 md:px-0">
        <div className="col-span-1 flex flex-col md:col-span-2">
          <Link href="/guides" prefetch={false}>
            <a>
              <h3 className="font-medium text-zinc-100 hover:underline hover:decoration-wavy">
                Guides
              </h3>
            </a>
          </Link>
          <Link href="/docs" prefetch={false}>
            <a className="hover:text-zinc-100 hover:underline hover:decoration-wavy">
              Developer docs
            </a>
          </Link>
          <Link href="/guides/onboarding-checklist" prefetch={false}>
            <a className="hover:text-zinc-100 hover:underline hover:decoration-wavy">
              Onboarding checklist
            </a>
          </Link>
          <Link
            href="/guides/segment-proxy-using-cloudflare-workers"
            prefetch={false}
          >
            <a className="hover:text-zinc-100 hover:underline hover:decoration-wavy">
              Segment proxy using CF Workers
            </a>
          </Link>
          <Link href="/guides/forwarding-email-gmail" prefetch={false}>
            <a className="hover:text-zinc-100 hover:underline hover:decoration-wavy">
              Configuring Gmail Forwarding
            </a>
          </Link>
          <Link
            href="/guides/forwarding-email-google-admin-routing"
            prefetch={false}
          >
            <a className="hover:text-zinc-100 hover:underline hover:decoration-wavy">
              Configuring Google&rsquo;s Default Routing
            </a>
          </Link>
        </div>

        <div className="col-span-1 flex flex-col md:col-span-2">
          <Link href="/blog" prefetch={false}>
            <a>
              <h3 className="font-medium text-zinc-100 hover:underline hover:decoration-wavy">
                Blog
              </h3>
            </a>
          </Link>
          {(props.blogs || []).map((b) => (
            <Link
              key={b.id}
              href={{ pathname: "/blog/[id]", query: { id: b.id } }}
              prefetch={false}
            >
              <a className="hover:text-zinc-100 hover:underline hover:decoration-wavy">
                {b.title}
              </a>
            </Link>
          ))}
        </div>

        <div className="col-span-1 flex flex-col md:col-span-1">
          <Link href="/changelog" prefetch={false}>
            <a>
              <h3 className="font-medium text-zinc-100 hover:underline hover:decoration-wavy">
                Changelog
              </h3>
            </a>
          </Link>
          {(props.changelogs || []).map((c) => (
            <Link
              key={c.id}
              href={{ pathname: "/changelog", hash: c.id }}
              prefetch={false}
            >
              <a className="hover:text-zinc-100 hover:underline hover:decoration-wavy">
                {c.title}
              </a>
            </Link>
          ))}
        </div>

        {/* <div className="col-span-1 flex flex-col md:col-span-2">
          <div className="font-medium text-zinc-100">Resources</div>
          <div className="">Front vs Willow</div>
          <div className="">Zendesk vs Willow</div>
          <div className="">Hiver vs Willow</div>
          <div className="">Gmail collaborative inbox vs Willow</div>
          <div className="">Help scout vs Willow</div>
          <div className="">Drift vs Willow</div>
          <div className="">Kustomer vs Willow</div>
          <div className="">Freshdesk vs Willow</div>
          <div className="">Intercom vs Willow</div>
          <div className="">Gladly vs Willow</div>
          <div className="">Podium vs Willow</div>
          <div className="">Richpanel vs Willow</div>
          <div className="">Respond.io vs Willow</div>
          <div className="">Reekon vs Willow</div>
          <div className="">Help Crunch vs Willow</div>
          <div className="">Desky vs Willow</div>
          <div className="">Help Ninja vs Willow</div>
          <div className="">Groove vs Willow</div>
          <div className="">Helpdesk.com vs Willow</div>
          <div className="">Help scout vs Willow</div>
          <div className="">Engage vs Willow</div>
          <div className="">Labi Desk vs Willow</div>
        </div> */}

        <div className="col-span-1 flex flex-col md:col-span-1">
          <h3 className="font-medium text-zinc-100">Company</h3>
          <div className="">
            <Link href="/" prefetch={false}>
              <a className="hover:text-zinc-100 hover:underline hover:decoration-wavy">
                Home
              </a>
            </Link>
          </div>
          <div className="">
            <Link href="/privacy-policy" prefetch={false}>
              <a className="hover:text-zinc-100 hover:underline hover:decoration-wavy">
                Privacy Policy
              </a>
            </Link>
          </div>
          <div className="">
            <Link href="/terms-of-service" prefetch={false}>
              <a className="hover:text-zinc-100 hover:underline hover:decoration-wavy">
                Terms of service
              </a>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
