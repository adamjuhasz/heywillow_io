import { NextApiRequest, NextApiResponse } from "next";

import apiHandler from "server/apiHandler";
import { serviceSupabase } from "server/supabase";
import { SupabaseCustomerEvent } from "types/supabase";

export default apiHandler({ post: handler });

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Record<string, never> | { message: string }>
): Promise<void> {
  await serviceSupabase
    .from<SupabaseCustomerEvent>("CustomerEvent")
    .select("*")
    .lte("createdAt", new Date().toISOString());

  return res.status(200).json({});
}
