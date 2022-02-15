import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useUser } from "components/UserContext";

interface ServerSideProps {
  clientId: string;
}

export const getServerSideProps: GetServerSideProps<
  ServerSideProps
> = async () => {
  return {
    props: { clientId: process.env.GOOGLE_CLIENT_ID as string },
  };
};

export default function LinkGmail(props: ServerSideProps) {
  const router = useRouter();
  const { user } = useUser();

  useEffect(() => {
    if (user === null || user === undefined) {
      return;
    }

    const qs = new URLSearchParams();
    qs.set("client_id", props.clientId);
    qs.set(
      "redirect_uri",
      `${document.location.origin}/api/v1/auth/google/callback`
    );
    qs.set("response_type", "code");
    qs.set("scope", "https://mail.google.com/");
    qs.set("access_type", "offline");
    qs.set("state", "offline");
    qs.set("state", JSON.stringify({ u: user.id, t: 1 }));

    console.log("");
    document.location.assign(
      `https://accounts.google.com/o/oauth2/v2/auth?${qs.toString()}`
    );
  }, [user, props.clientId, router]);
  return <></>;
}
