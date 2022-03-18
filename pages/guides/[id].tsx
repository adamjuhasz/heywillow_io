import {
  GetStaticPathsResult,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from "next";
import { ParsedUrlQuery } from "querystring";
import Head from "next/head";
import format from "date-fns/format";
import sample from "lodash/sample";

import { getAllPostIds, getPostData } from "static-build/guides";
import LandingPageHeader from "components/LandingPage/Header";

interface Params extends ParsedUrlQuery {
  id: string;
}

export async function getStaticPaths(): Promise<GetStaticPathsResult<Params>> {
  const paths = getAllPostIds();
  return {
    paths,
    fallback: true,
  };
}

export async function getStaticProps({
  params,
}: GetStaticPropsContext<Params>): Promise<GetStaticPropsResult<Props>> {
  const postData = await getPostData((params as Params).id);

  return {
    props: {
      postData,
    },
  };
}

const colors = [
  "bg-red-300",
  "bg-orange-300",
  "bg-amber-300",
  "bg-yellow-300",
  "bg-lime-300",
  "bg-green-300",
  "bg-emerald-300",
  "bg-teal-300",
  "bg-cyan-300",
  "bg-sky-300",
  "bg-blue-300",
  "bg-indigo-300",
  "bg-violet-300",
  "bg-fuchsia-300",
  "bg-pink-300",
  "bg-rose-300",
];

interface Props {
  postData: Record<string, string>;
}

export default function Post({ postData }: Props) {
  return (
    <>
      <Head>
        <title>{postData.title}</title>
        <style>
          {`
          .prose .task-list-item > [type='checkbox'] {
            border-radius: 4px;
            margin-top: -3px;
            margin-right: 0.25rem;
          }
        `}
        </style>
      </Head>

      <LandingPageHeader />

      <div
        className={[
          "my-2 mx-auto aspect-[12/4] w-full max-w-6xl rounded-3xl px-2 py-2",
          sample([
            "shadow-orange-300/30",
            "shadow-lime-300/30",
            "shadow-sky-300/30",
            "shadow-purple-300/30",
            "shadow-pink-300/30",
          ]),
        ].join(" ")}
      >
        <div className="grid h-full w-full grid-cols-12 grid-rows-4 overflow-clip rounded-3xl bg-zinc-700">
          {Array(12 * 4)
            .fill(null)
            .map((_, idx) => (
              <div
                key={idx}
                className={[
                  sample(colors),
                  "relative h-full w-full overflow-clip",
                ].join(" ")}
              >
                {sample([
                  <></>,
                  <></>,
                  <></>,
                  <></>,
                  <div
                    key={`${idx}-sub-1`}
                    className={[
                      sample(colors),
                      "absolute left-[50%] top-[50%] h-full w-full scale-[2.0] rounded-full",
                    ].join(" ")}
                  />,
                  <div
                    key={`${idx}-sub-2`}
                    className={[
                      sample(colors),
                      "absolute left-[50%] bottom-[50%] h-full w-full scale-[2.0] rounded-full",
                    ].join(" ")}
                  />,
                  <div
                    key={`${idx}-sub-3`}
                    className={[
                      sample(colors),
                      "absolute right-[50%] bottom-[50%] h-full w-full scale-[2.0] rounded-full",
                    ].join(" ")}
                  />,
                  <div
                    key={`${idx}-sub-3`}
                    className={[
                      sample(colors),
                      "absolute right-[50%] top-[50%] h-full w-full scale-[2.0] rounded-full",
                    ].join(" ")}
                  />,
                  <div
                    key={`${idx}-sub-3`}
                    className={[
                      sample(colors),
                      "absolute right-[50%] bottom-[50%] h-full w-full origin-center rotate-45 scale-[1.414]",
                    ].join(" ")}
                  />,
                  <div
                    key={`${idx}-sub-3`}
                    className={[
                      sample(colors),
                      "absolute right-[50%] top-[50%] h-full w-full origin-center rotate-45 scale-[1.414]",
                    ].join(" ")}
                  />,
                ])}
              </div>
            ))}
        </div>
      </div>

      <div className="mt-4 flex w-full flex-col items-center">
        <h1 className="text-center text-5xl">{postData.title}</h1>
        <time
          dateTime={postData.date}
          className="mt-1 w-full text-center text-sm text-zinc-400"
        >
          Last updated: {format(new Date(postData.date), "LLLL d, yyyy")}
        </time>
        <hr className="my-7 w-full max-w-2xl border-zinc-700" />
      </div>

      <article className="prose prose-invert mx-auto max-w-4xl px-4 prose-h1:font-semibold prose-code:bg-black prose-code:p-1 prose-code:font-mono prose-code:before:content-none prose-code:after:content-none prose-hr:mx-auto prose-hr:w-10/12 prose-hr:border-zinc-600">
        <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
      </article>
    </>
  );
}
