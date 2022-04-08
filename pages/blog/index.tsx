import Link from "next/link";
import { NextSeo } from "next-seo";
import { GetStaticPropsContext, GetStaticPropsResult } from "next";
import orderBy from "lodash/orderBy";

import {
  Post,
  blogDirectory,
  changelogDirectory,
  getAllPostIds,
  getPostData,
  getSortedPostsData,
} from "static-build/posts";

import LandingPageHeader from "components/LandingPage/Header";
import LandingPageFooter from "components/LandingPage/Footer";
import PostHeader from "components/Posts/Header";

interface StaticProps {
  blogPosts: Post[];
  changelogs: Post[];
}

export async function getStaticProps(
  _params: GetStaticPropsContext
): Promise<GetStaticPropsResult<StaticProps>> {
  const blogPosts = await getSortedPostsData(blogDirectory);

  const changelogs = getAllPostIds(changelogDirectory);
  const changelogPosts = await Promise.all(
    orderBy(changelogs, ["param.id"], ["desc"]).map(({ params: { id } }) =>
      getPostData(changelogDirectory, id)
    )
  );

  return {
    props: {
      blogPosts: blogPosts.filter((p) => p.id.startsWith("wip-") === false),
      changelogs: changelogPosts.filter(
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

      <PostHeader>
        <div className="">Blog</div>
        <div className="text-lg font-light text-zinc-300"></div>
      </PostHeader>

      <div className="mx-auto max-w-4xl px-2 lg:px-0">
        <ul className="">
          {props.blogPosts.map((post, idx, arr) => (
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

      <LandingPageFooter
        blogs={props.blogPosts}
        changelogs={props.changelogs}
      />
    </>
  );
}
