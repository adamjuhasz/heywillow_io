import { useRouter } from "next/router";
import { useEffect } from "react";

export default function NamespaceIndex() {
  const router = useRouter();
  useEffect(() => {
    void router.replace({
      pathname: "/a/[namespace]/workspace",
      query: router.query,
    });
  }, [router]);
}
