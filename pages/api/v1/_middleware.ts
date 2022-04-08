import type { NextFetchEvent } from "next/server";
import { NextRequest, NextResponse } from "next/server";

export default async function middleware(
  request: NextRequest,
  _event: NextFetchEvent
): Promise<Response | undefined> {
  if (
    request.nextUrl.pathname.startsWith("/api/v1/user") ||
    request.nextUrl.pathname.startsWith("/api/v1/group")
  ) {
    const docsURL = request.nextUrl.href
      .replace("/api/", "/docs/")
      .replace("http://", "https://");

    const response = NextResponse.next();

    if (response.headers.has("X-Documentation") === false) {
      response.headers.set(
        "Link",
        `<${docsURL}>; rel="documentation"; title="API Docs"`
      );
      response.headers.set("X-Documentation", `${docsURL}`);
    }

    return response;
  } else {
    return NextResponse.next();
  }
}
