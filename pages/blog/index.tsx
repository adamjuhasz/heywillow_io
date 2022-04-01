import Link from "next/link";
import { NextSeo } from "next-seo";

import { Post, blogDirectory, getSortedPostsData } from "static-build/posts";

import LandingPageHeader from "components/LandingPage/Header";
import LandingPageFooter from "components/LandingPage/Footer";

interface StaticProps {
  allPostsData: Post[];
}

// eslint-disable-next-line require-await
export async function getStaticProps() {
  const allPostsData = await getSortedPostsData(blogDirectory);
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
        description="A set of blogs about Willow and Customer support"
      />

      <LandingPageHeader />

      <div className="mb-7 border-b border-t border-zinc-600 bg-black pt-10 pb-10 text-3xl">
        <div className="mx-auto max-w-4xl">Blog</div>
      </div>

      <div className="mx-auto max-w-4xl">
        <ul className="before:">
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
                {post.formattedDate.endsWith}
              </time>
              <Link href={`/blog/${post.id}`}>
                <a className="mb-3 text-2xl text-zinc-100 hover:underline">
                  {post.title}
                </a>
              </Link>
              <div className="text-base font-light text-zinc-200">
                {post.excerpt}
              </div>
              <Link href={`/blog/${post.id}`}>
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
