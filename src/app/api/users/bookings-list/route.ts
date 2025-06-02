import { getAllBookings } from "@/lib/bookingsList";
import { getCurrentUser } from "@/lib/currentUser";
import { NextResponse } from "next/server";

export async function GET() {
  const { reservations, error, details, status } = await getAllBookings();

  if (error) {
    return NextResponse.json(
      { reservations: null, error, details },
      { status }
    );
  }

  return NextResponse.json({ reservations }, { status: 200 });
}
