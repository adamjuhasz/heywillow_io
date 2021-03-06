import { GetStaticPropsContext, GetStaticPropsResult } from "next";
import { NextSeo } from "next-seo";
import { ParsedUrlQuery } from "querystring";
import orderBy from "lodash/orderBy";

import LandingPageHeader from "components/LandingPage/Header";
import LandingPageFooter from "components/LandingPage/Footer";
import DesignPageContainer from "components/Design/PageContainer";

import {
  Post as IPost,
  blogDirectory,
  changelogDirectory,
  getAllPostIds,
  getPostData,
  getSortedPostsData,
} from "static-build/posts";

interface Params extends ParsedUrlQuery {
  id: string;
}

export async function getStaticProps(
  _params: GetStaticPropsContext<Params>
): Promise<GetStaticPropsResult<Props>> {
  try {
    const changelogs = getAllPostIds(changelogDirectory);
    const changelogPosts = await Promise.all(
      orderBy(changelogs, ["param.id"], ["desc"]).map(({ params: { id } }) =>
        getPostData(changelogDirectory, id)
      )
    );
    const blogPosts = (await getSortedPostsData(blogDirectory)).filter(
      (p) => p.id.startsWith("wip-") === false
    );

    return {
      props: {
        changelogs: changelogPosts,
        blogPosts: blogPosts,
      },
    };
  } catch (e) {
    console.error(e);
  }

  return { notFound: true };
}

interface Props {
  changelogs: IPost[];
  blogPosts: IPost[];
}

export default function DesignPatterns(props: Props) {
  return (
    <>
      <NextSeo
        title="Vertex design language using Tailwind CSS"
        description="Vercel inspired design language built using Tailwind CSS"
      />

      <LandingPageHeader />

      <DesignPageContainer></DesignPageContainer>

      <LandingPageFooter
        changelogs={props.changelogs}
        blogs={props.blogPosts}
      />
    </>
  );
}
