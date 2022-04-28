import { GetStaticPropsContext, GetStaticPropsResult } from "next";
import { NextSeo } from "next-seo";
import { ParsedUrlQuery } from "querystring";
import orderBy from "lodash/orderBy";
import fs from "fs";
import path from "path";

import LandingPageHeader from "components/LandingPage/Header";
import LandingPageFooter from "components/LandingPage/Footer";
import DesignPageContainer from "components/Design/PageContainer";
import Fieldset, { Title } from "components/Design/Fieldset";
import Button from "components/Design/Button";

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
    const buttonFile = fs
      .readFileSync(path.join(process.cwd(), "components/Design/Button.tsx"))
      .toString();
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
        code: buttonFile,
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
  code: string;
}

export default function DesignPatterns(props: Props) {
  return (
    <>
      <NextSeo
        title="Vertex design language using Tailwind CSS"
        description="Vercel inspired design language built using Tailwind CSS"
      />

      <LandingPageHeader />

      <DesignPageContainer className="space-y-3">
        <Fieldset>
          <Title>Sized</Title>
          <div className="flex space-x-3">
            <Button size="small">Small</Button>
            <Button>Normal</Button>
            <Button size="large">Large</Button>
          </div>
        </Fieldset>

        <Fieldset>
          <Title>Shapes</Title>
          <div className="flex space-x-3">
            <Button size="small" shape="square">
              S
            </Button>
            <Button size="normal" shape="square">
              Sq
            </Button>
            <Button size="large" shape="square">
              Square
            </Button>

            <Button size="small" shape="circle">
              C
            </Button>
            <Button size="normal" shape="circle">
              Cir
            </Button>
            <Button size="large" shape="circle">
              Circle
            </Button>
          </div>
        </Fieldset>

        <Fieldset>
          <Title>Types</Title>
          <div className="flex space-x-3">
            <Button type="secondary">Secondary</Button>
            <Button type="success">Success</Button>
            <Button type="error">Error</Button>
            <Button type="warning">Warning</Button>
            <Button type="alert">Alert</Button>
            <Button type="tertiary">Tertiary</Button>
          </div>
        </Fieldset>

        <Fieldset>
          <Title>Variant - Shadow</Title>
          <div className="flex space-x-3">
            <Button variant="shadow">Upload</Button>
            <Button type="secondary" variant="shadow">
              Upload
            </Button>
            <Button type="success" variant="shadow">
              Upload
            </Button>
            <Button type="error" variant="shadow">
              Upload
            </Button>
            <Button type="warning" variant="shadow">
              Upload
            </Button>
            <Button type="alert" variant="shadow">
              Upload
            </Button>
            <Button type="tertiary" variant="shadow">
              Upload
            </Button>
          </div>
        </Fieldset>

        <Fieldset>
          <Title>Variant - Ghost</Title>
          <div className="flex space-x-3">
            <Button variant="ghost">Upload</Button>
            <Button type="secondary" variant="ghost">
              Upload
            </Button>
            <Button type="success" variant="ghost">
              Upload
            </Button>
            <Button type="error" variant="ghost">
              Upload
            </Button>
            <Button type="warning" variant="ghost">
              Upload
            </Button>
            <Button type="alert" variant="ghost">
              Upload
            </Button>
            <Button type="tertiary" variant="ghost">
              Upload
            </Button>
          </div>
        </Fieldset>

        <Fieldset>
          <Title>Loading</Title>
          <div className="flex space-x-3">
            <Button size="small" loading>
              Upload
            </Button>
            <Button loading>Upload</Button>
            <Button size="large" loading>
              Upload
            </Button>
          </div>
        </Fieldset>

        <Fieldset>
          <Title>Disabled</Title>
          <div className="flex space-x-3">
            <Button size="small" disabled>
              Upload
            </Button>
            <Button disabled>Upload</Button>
            <Button size="large" disabled>
              Upload
            </Button>
          </div>
        </Fieldset>

        <Fieldset>
          <Title>Button&rsquo;s code</Title>
          <pre className="text-xs">{props.code}</pre>
        </Fieldset>
      </DesignPageContainer>

      <LandingPageFooter
        changelogs={props.changelogs}
        blogs={props.blogPosts}
      />
    </>
  );
}
