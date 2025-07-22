import { NextRequest, NextResponse } from "next/server";
import * as jose from 'jose';

export async function middleware(request: NextRequest) {
  try {
    const access_token = request.cookies.get("access_token")?.value;
    const secret = process.env.JWT_SECRET_KEY;
    const { pathname } = request.nextUrl;
    
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

      // Extraire le rôle de l'utilisateur
      const userRole = payload.role as string;

      // Vérifier les permissions selon le rôle
      if (pathname.startsWith('/admin')) {
        // Seuls les administrateurs peuvent accéder aux routes admin
        if (userRole !== 'ADMIN') {
          console.log(`Accès refusé: ${userRole} tente d'accéder à ${pathname}`);
          return NextResponse.redirect(new URL("/users/dashboard", request.url));
        }
      } else if (pathname.startsWith('/users')) {
        // Les utilisateurs non-admin ne peuvent pas accéder aux routes admin
        if (userRole === 'ADMIN') {
          // Les admins peuvent accéder aux routes users
          return NextResponse.next();
        }
        
        // Vérifier que l'utilisateur a un rôle valide
        if (!['COMPANY', 'AGENT_GARE', 'EXPEDITEUR'].includes(userRole)) {
          console.log(`Rôle invalide: ${userRole}`);
          return NextResponse.redirect(new URL("/auth/login", request.url));
        }
      }

      // Si toutes les vérifications passent, permettre l'accès
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