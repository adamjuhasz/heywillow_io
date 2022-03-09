import type { NextApiRequest, NextApiResponse } from "next";
import { serviceSupabase } from "server/supabase";

import apiHandler from "server/apiHandler";

export default apiHandler({
  post: handler,
});

async function handler(req: NextApiRequest, res: NextApiResponse<unknown>) {
  const auth = await serviceSupabase.auth.api.getUserByCookie(req);
  res.send(JSON.stringify(auth, null, 2));
}
