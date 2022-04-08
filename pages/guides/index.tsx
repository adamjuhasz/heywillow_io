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
  guidesDirectory,
} from "static-build/posts";

import LandingPageHeader from "components/LandingPage/Header";
import LandingPageFooter from "components/LandingPage/Footer";
import PostHeader from "components/Posts/Header";

interface StaticProps {
  guidePosts: Post[];
  blogPosts: Post[];
  changelogs: Post[];
}

export async function getStaticProps(
  _params: GetStaticPropsContext
): Promise<GetStaticPropsResult<StaticProps>> {
  const guidePosts = await getSortedPostsData(guidesDirectory);

  const blogPosts = await getSortedPostsData(blogDirectory);

  const changelogs = getAllPostIds(changelogDirectory);
  const changelogPosts = await Promise.all(
    orderBy(changelogs, ["param.id"], ["desc"]).map(({ params: { id } }) =>
      getPostData(changelogDirectory, id)
    )
  );

  return {
    props: {
      guidePosts: guidePosts.filter((p) => p.id.startsWith("wip-") === false),
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
        description="A set of guides to get Willow working with a bunch of other platforms and services"
      />

      <LandingPageHeader />

      <PostHeader>
        <div className="">Guides</div>
        <div className="text-lg font-light text-zinc-300"></div>
      </PostHeader>

      <div className="mx-auto flex max-w-4xl px-2 py-7 lg:flex-row-reverse lg:px-0">
        <div className="ml-4 hidden h-fit grow flex-col space-y-1 rounded-md border border-zinc-600 p-3 lg:flex">
          <div className="text-lg font-medium">Top Posts</div>
          {props.guidePosts.map((p) => (
            <Link href={`/guides/${p.id}`} key={p.id}>
              <a className="text-sm line-clamp-1">
                • <span className="hover:underline">{p.title}</span>
              </a>
            </Link>
          ))}
        </div>

        <ul className="w-full shrink-0 grow-0 lg:w-4/6">
          {props.guidePosts.map((post, idx, arr) => (
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

      <LandingPageFooter
        blogs={props.blogPosts}
        changelogs={props.changelogs}
      />
    </>
  );
}
