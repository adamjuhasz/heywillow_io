import Head from "next/head";
import { format } from "date-fns";
import { getAllPostIds, getPostData } from "static/changelog";

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
      <div className="prose prose-invert mx-auto max-w-4xl">
        <time dateTime={postData.date}>
          {format(new Date(postData.date), "LLLL d, yyyy")}
        </time>

        <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
      </div>
    </>
  );
}
