import { useRouter } from "next/router";
import { ReactElement, useEffect } from "react";
import { NextSeo } from "next-seo";

import AppLayout from "layouts/app";

export default function NamespaceIndex() {
  const router = useRouter();
  useEffect(() => {
    void router.replace({
      pathname: "/demo/[namespace]/workspace",
      query: { namespace: "stealth" },
    });
  }, [router]);

  return (
    <>
      <NextSeo
        title="Willow Demo"
        description="Fully interactive demo of the Willow Customer support platform. Explore and interact with realistic data."
      />
      <h1 className="text-transparent">Redirecting to demo</h1>
    </>
  );
}

NamespaceIndex.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
