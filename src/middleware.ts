// src/middleware.ts
import { NextRequest, NextResponse } from "next/server";
import * as jose from 'jose'; // Importez jose au lieu de jsonwebtoken

export async function middleware(request: NextRequest) {
  try {
    const access_token = request.cookies.get("access_token")?.value;
    const secret = process.env.JWT_SECRET_KEY;
    
    // Vérifier si le token existe
    if (!access_token) {
      console.log("Pas de token d'accès trouvé");
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    // Vérifier si la clé secrète est définie
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
      // En cas d'erreur spécifique de JWT (token expiré, invalide, etc.)
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
  matcher: ["/admin/:path*"],
};