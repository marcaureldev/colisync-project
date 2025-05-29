import { NextRequest, NextResponse } from "next/server";
import * as jose from 'jose';

export async function middleware(request: NextRequest) {
  try {
    const access_token = request.cookies.get("access_token")?.value;
    const secret = process.env.JWT_SECRET_KEY;
    
    // Vérification de l'existence du token
    if (!access_token) {
      console.log("Pas de token d'accès trouvé");
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    // Vérification de la clé secrète
    if (!secret) {
      console.error("JWT_SECRET_KEY not defined in environment variables");
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    try {
      // Vérifier si le token est valide avec jose
      const secretKey = new TextEncoder().encode(secret);
      const { payload } = await jose.jwtVerify(access_token, secretKey);

      // Si la vérification réussit, permettre l'accès
      return NextResponse.next();
    } catch (jwtError) {
      console.error("JWT verification error:", jwtError);
      const response = NextResponse.redirect(
        new URL("/auth/login", request.url)
      );
      response.cookies.delete("access_token");
      return response;
    }
  } catch (error) {
    console.error("Middleware error:", error);
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }
}

export const config = {
  matcher: ["/admin/:path*", "/users/:path*"],
};