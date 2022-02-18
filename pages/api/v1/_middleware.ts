import {
  NextFetchEvent,
  NextMiddleware,
  NextRequest,
  NextResponse,
} from "next/server";

import { serviceSupabase } from "server/supabase";

export const middleware: NextMiddleware = async (
  req: NextRequest,
  _event: NextFetchEvent
) => {
  const { user } = await serviceSupabase.auth.api.getUserByCookie(req);
  console.log("middleware user", user);

  return NextResponse.next();
};
