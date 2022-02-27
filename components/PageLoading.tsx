import Router from "next/router";
import { useEffect, useState } from "react";

export default function PageLoading() {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleStart = () => {
      setLoading(true);
    };

    const handleEnd = () => {
      setLoading(false);
    };

    Router.events.on("routeChangeStart", handleStart);
    Router.events.on("routeChangeComplete", handleEnd);
    Router.events.on("routeChangeError", handleEnd);

    return () => {
      Router.events.off("routeChangeStart", handleStart);
      Router.events.off("routeChangeComplete", handleEnd);
      Router.events.off("routeChangeError", handleEnd);
    };
  });

  return (
    <div
      className={[
        "fixed top-0 z-20 h-0.5 w-screen animate-loading bg-[length:200%]",
        // "bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 ",
        "bg-gradient-to-r from-sky-400 via-rose-400 to-lime-400",
        loading ? "block" : "hidden",
      ].join(" ")}
    />
  );
}
