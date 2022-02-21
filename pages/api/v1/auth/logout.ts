import type { NextApiRequest, NextApiResponse } from "next";
import { serviceSupabase } from "server/supabase";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<unknown>
) {
  console.log("logout");
  serviceSupabase.auth.api.deleteAuthCookie(req, res, { redirectTo: "/" });
}
