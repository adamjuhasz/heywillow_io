import { useRouter } from "next/router";

import { useSupabase } from "components/UserContext";
import { SupabaseAttachment } from "types/supabase";

export default function Attachment({
  filename,
  location,
}: SupabaseAttachment): JSX.Element {
  const supabase = useSupabase();
  const router = useRouter();

  return (
    <div
      className="w-fit cursor-pointer rounded-sm bg-purple-300 px-1 py-0.5 text-xs text-white"
      onClick={async () => {
        if (supabase) {
          const parts = location.split("/");
          const bucket = parts[0];
          const path = parts.slice(1).join("/");
          console.log(bucket, path);
          const url = await supabase.storage
            .from(bucket)
            .createSignedUrl(path, 60 * 60 * 24);
          console.log(url);
          if (url.error) {
            console.error(url.error);
            return;
          }
          void router.push(url.data?.signedURL as string);
        }
      }}
    >
      {filename}
    </div>
  );
}
