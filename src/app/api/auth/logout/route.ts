import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("access_token");
    return NextResponse.json(
      {
        success: true,
        message: "Déconnexion réussie",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Une erreur est survenue lors de la déconnexion", success: false },
      { status: 500 }
    );
  }
}
