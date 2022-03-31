import Link from "next/link";
import { NextSeo } from "next-seo";

import { Post, getSortedPostsData, guidesDirectory } from "static-build/posts";

import LandingPageHeader from "components/LandingPage/Header";
import LandingPageFooter from "components/LandingPage/Footer";

interface StaticProps {
  allPostsData: Post[];
}

export async function getStaticProps() {
  const allPostsData = await getSortedPostsData(guidesDirectory);
  console.log(allPostsData);

  return {
    props: {
      allPostsData: allPostsData.filter(
        (p) => p.id.startsWith("wip-") === false
      ),
    },
  };
}

export default function Blog(props: StaticProps) {
  return (
    <>
      <NextSeo
        title="Willow Guides"
        description="A set of guides to get Willow working with a bunch of other platforms and services"
      />

      <LandingPageHeader />

      <div className="mb-7 border-b border-t border-zinc-600 bg-black pt-10 pb-10 text-3xl">
        <div className="mx-auto max-w-4xl">Guides</div>
      </div>

      <div className="mx-auto flex max-w-4xl flex-row-reverse">
        <div className="ml-4 flex h-fit grow flex-col space-y-1 rounded-md border border-zinc-600 p-3">
          <div className="text-lg font-medium">Top Posts</div>
          {props.allPostsData.map((p) => (
            <Link href={`/guides/${p.id}`} key={p.id}>
              <a className="text-sm line-clamp-1">
                • <span className="hover:underline">{p.title}</span>
              </a>
            </Link>
          ))}
        </div>
        <ul className="w-2xl shrink-0">
          {props.allPostsData.map((post, idx, arr) => (
            <li
              className={[
                "mb-7 flex flex-col  pb-3",
                idx !== arr.length - 1 ? "border-b border-zinc-600" : "",
              ].join(" ")}
              key={post.id}
            >
              <time
                dateTime={post.date}
                className="mb-3 font-light text-zinc-400"
              >
                {post.formattedDate}
              </time>
              <Link href={`/guides/${post.id}`}>
                <a className="mb-3 text-2xl text-zinc-100 hover:underline">
                  {post.title}
                </a>
              </Link>
              <div
                className="prose prose-invert font-light text-zinc-200"
                dangerouslySetInnerHTML={{ __html: post.excerptHtml }}
              />
              <Link href={`/guides/${post.id}`}>
                <a className="mt-3 mb-3 text-base capitalize text-blue-500 hover:underline">
                  READ MORE →
                </a>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <LandingPageFooter />
    </>
  );
}
