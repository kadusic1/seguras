import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { ITEMS_PER_PAGE } from "@/lib/pagination";

export async function GET(request: NextRequest) {
  const apiUrl = process.env.API_URL;
  if (!apiUrl) {
    return NextResponse.json(
      { error: "Backend API not configured" },
      { status: 500 },
    );
  }

  const session = await auth();
  if (!session?.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const params = new URLSearchParams({
    page: request.nextUrl.searchParams.get("page") ?? "1",
    per_page:
      request.nextUrl.searchParams.get("per_page") ?? String(ITEMS_PER_PAGE),
  });

  const res = await fetch(`${apiUrl}/contact?${params}`, {
    headers: { Authorization: `Bearer ${session.accessToken}` },
    cache: "no-store",
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

export async function POST(request: NextRequest) {
  const apiUrl = process.env.API_URL;
  if (!apiUrl) {
    return NextResponse.json(
      { error: "Backend API not configured" },
      { status: 500 },
    );
  }

  const body = await request.json();

  const res = await fetch(`${apiUrl}/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
