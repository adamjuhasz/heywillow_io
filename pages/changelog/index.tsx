import { NextSeo } from "next-seo";
import format from "date-fns/format";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import subHours from "date-fns/subHours";
import { GetStaticPropsContext, GetStaticPropsResult } from "next";
import Link from "next/link";

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

interface StaticProps {
  changelogs: Post[];
  blogs: Post[];
}

export async function getStaticProps(
  _params: GetStaticPropsContext
): Promise<GetStaticPropsResult<StaticProps>> {
  const changelogs = await getAllPostIds(changelogDirectory);
  const changelogPosts = await Promise.all(
    changelogs.map(({ params: { id } }) => getPostData(changelogDirectory, id))
  );

  const blogPosts = await getSortedPostsData(blogDirectory);

  return {
    props: {
      changelogs: changelogPosts.filter(
        (p) => p.id.startsWith("wip-") === false
      ),
      blogs: blogPosts.filter((p) => p.id.startsWith("wip-") === false),
    },
  };
}

export default function Blog(props: StaticProps) {
  return (
    <>
      <NextSeo
        title="Willow Changelog"
        description="New updates and improvements to Willow"
      />

      <LandingPageHeader />

      <div className=" border-b border-t border-zinc-600 bg-black pt-10 pb-10 text-3xl">
        <div className="mx-auto flex max-w-4xl flex-col">
          <div>Changelog</div>
          <div className="text-lg font-light text-zinc-300">
            New updates and improvements to Willow
          </div>
        </div>
      </div>

      <div className="mx-auto my-7 max-w-4xl">
        <ul className="">
          {props.changelogs.map((post, idx, arr) => (
            <li
              id={post.id}
              className={[
                "flex scroll-m-32",
                idx !== arr.length - 1 ? "border-b border-zinc-600" : "",
              ].join(" ")}
              key={post.id}
            >
              <div className="mt-1 flex w-2/12 flex-col font-light">
                <Link href={{ hash: post.id }}>
                  <a>
                    <time
                      dateTime={post.id}
                      className="text-zinc-100 hover:underline"
                    >
                      {format(subHours(new Date(post.id), -7), "MMM d Y")}
                    </time>
                  </a>
                </Link>
                <div className="text-xs text-zinc-400">
                  {formatDistanceToNow(subHours(new Date(post.id), -7), {
                    addSuffix: true,
                    includeSeconds: false,
                  })}
                </div>
              </div>
              <article
                className={[
                  "prose prose-invert",
                  "prose-img:w-96 prose-img:rounded-xl prose-img:border-2 prose-img:border-zinc-800",
                ].join(" ")}
                dangerouslySetInnerHTML={{ __html: post.contentHtml }}
              />
            </li>
          ))}
        </ul>
      </div>

      <LandingPageFooter changelogs={props.changelogs} blogs={props.blogs} />
    </>
  );
}
