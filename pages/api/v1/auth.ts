import type { NextApiRequest, NextApiResponse } from "next";
import { GoTrueClient } from "@supabase/gotrue-js";

import apiHandler from "server/apiHandler";

const myCustomAuthClient = new GoTrueClient({
  url: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1`,
  headers: {
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
    apikey: `${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
  },
  cookieOptions: {
    name: "sb",
    lifetime: 604800, //seconds from https://app.supabase.io/project/ygdlkvsxphwkmneocxtd/auth/settings
    domain: "",
    path: "/",
    sameSite: "lax",
  },
});

function handler(req: NextApiRequest, res: NextApiResponse<unknown>) {
  return myCustomAuthClient.api.setAuthCookie(req, res);
}

export default apiHandler({ post: handler });
