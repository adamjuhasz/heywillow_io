import { useRouter } from "next/router";
import { ReactElement, useEffect } from "react";

import AppLayout from "layouts/app";

export default function DocsIndex() {
  const router = useRouter();
  useEffect(() => {
    void router.replace({
      pathname: "/docs/v1/introduction",
    });
  }, [router]);

  return <></>;
}

DocsIndex.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
