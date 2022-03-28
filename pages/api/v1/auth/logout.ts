import type { NextApiRequest, NextApiResponse } from "next";

import { serviceSupabase } from "server/supabase";
import apiHandler from "server/apiHandler";

export default apiHandler({
  get: handler,
});

async function handler(req: NextApiRequest, res: NextApiResponse<unknown>) {
  serviceSupabase.auth.api.deleteAuthCookie(req, res, { redirectTo: "/" });
}
