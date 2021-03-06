import { useRouter } from "next/router";
import { ReactElement, useEffect } from "react";

import AppLayout from "layouts/app";

export default function NamespaceIndex() {
  const router = useRouter();
  useEffect(() => {
    void router.replace({
      pathname: "/a/workspace",
    });
  }, [router]);

  return <></>;
}

NamespaceIndex.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
