import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

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

  const res = await fetch(`${apiUrl}/jobs/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${session.accessToken}` },
  });

  if (res.status === 204) {
    return new NextResponse(null, { status: 204 });
  }

  const data = await res.json().catch(() => null);
  return NextResponse.json(data, { status: res.status });
}
