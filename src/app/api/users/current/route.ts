import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/currentUser";

export async function GET() {
  const { user, error, details, status } = await getCurrentUser();

  if (error) {
    return NextResponse.json(
      { user: null, error, message: details },
      { status }
    );
  }

  return NextResponse.json({ user }, { status: 200 });
}