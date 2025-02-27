import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { NextRequest, NextFetchEvent } from "next/server";

const middleware = (req: NextRequest) => {
  const apiKey = req.headers.get("x-api-key");
  if (apiKey === process.env.MOBILE_API_KEY) {
    return NextResponse.next();
  }
  return clerkMiddleware(req, {} as NextFetchEvent);
};

export default middleware;

export const config = {
  matcher: ["/((?!api/mobile|_next/static|_next/image|favicon.ico).*)"],
};
