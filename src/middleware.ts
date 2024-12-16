import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  // Get the value of the 'isLoggedIn' cookie
  const isLoggedInCookie = req.cookies.get("isLoggedIn");

  // Check if the 'isLoggedIn' cookie exists and is equal to "true"
  const isLoggedIn = isLoggedInCookie
    ? isLoggedInCookie.value === "true"
    : false;

  // If not logged in, redirect to the login page
  if (!isLoggedIn && req.url.includes("/dashboard")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard", "/orders", "/petrol-orders", "/inventory", "/info"],
};
