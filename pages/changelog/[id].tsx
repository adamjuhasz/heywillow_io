import Head from "next/head";
import format from "date-fns/format";

import { getAllPostIds, getPostData } from "static-build/changelog";
import LandingPageHeader from "components/LandingPage/Header";

export async function getStaticPaths() {
  const paths = getAllPostIds();
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }: { params: { id: string } }) {
  const postData = await getPostData(params.id);
  return {
    props: {
      postData,
    },
  };
}

export default function Post({
  postData,
}: {
  postData: Record<string, string>;
}) {
  return (
    <>
      <Head>
        <title>{postData.title}</title>
      </Head>

      <LandingPageHeader />
      <div className="flex w-full flex-col items-center">
        <h1 className="text-center text-5xl">{postData.title}</h1>
        <time
          dateTime={postData.date}
          className="w-full text-center text-zinc-400"
        >
          {format(new Date(postData.date), "LLLL d, yyyy")}
        </time>
        <hr className="my-7 w-full max-w-2xl border-zinc-700" />
      </div>

      <article className="prose prose-invert mx-auto max-w-4xl prose-h1:font-semibold prose-code:bg-black prose-code:p-1 prose-code:font-mono prose-code:before:content-none prose-code:after:content-none prose-hr:mx-auto prose-hr:w-10/12 prose-hr:border-zinc-600">
        <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
      </article>
    </>
  );
}
