/* eslint-disable @next/next/no-title-in-document-head */
/* eslint-disable react/no-unescaped-entities */

import Document, {
  DocumentContext,
  Head,
  Html,
  Main,
  NextScript,
} from "next/document";

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html>
        <Head>
          <title>Willow - your customer's entire journey</title>
          <link
            rel="stylesheet"
            href="https://use.typekit.net/itm2wvw.css"
          ></link>
        </Head>
        <body className="bg-zinc-900 font-[rubik] text-zinc-100">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
