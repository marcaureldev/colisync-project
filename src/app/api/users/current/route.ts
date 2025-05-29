// import { cookies } from "next/headers";
// import { NextResponse } from "next/server";
// import jwt from "jsonwebtoken";
// import { prisma } from "@/lib/db";

// export async function GET() {
//   try {
//     const cookieStore = await cookies();

//     const access_token = cookieStore.get("access_token");

//     console.log(access_token);

//     const secret = process.env.JWT_SECRET;

//     if (!access_token) {
//       return NextResponse.json({ user: null }, { status: 401 });
//     }

//     if (!secret) {
//       return NextResponse.json({ user: null }, { status: 500 });
//     }

//     const payload = jwt.verify(access_token.value, secret);

//     const { id, email, role } = payload as {
//       id: string;
//       email: string;
//       role: string;
//     };

//     const user = prisma.user.findUnique({
//       where: { id, email },
//     });

//     return NextResponse.json({ user: user }, { status: 200 });
//   } catch (error) {
//     return NextResponse.json(
//       {
//         error:
//           "Une erreur est survenue lors de la récupération de l'utilisateur",
//         message: error,
//       },
//       { status: 500 }
//     );
//   }
// }


import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const access_token = cookieStore.get("access_token");

    console.log("Token:", access_token);

    if (!access_token) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const secret = process.env.JWT_SECRET_KEY;
    if (!secret) {
      console.error("JWT_SECRET manquant");
      return NextResponse.json({ user: null }, { status: 500 });
    }

    const payload = jwt.verify(access_token.value, secret) as {
      id: string;
      email: string;
      role: string;
    };

    const { id, email } = payload;

    const user = await prisma.user.findUnique({
      where: { id, email },
      select: {
        id: true,
        email: true,
        displayName: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });

    console.log("User:", user);

    if (!user) {
      return NextResponse.json({ user: null }, { status: 404 });
    }

    return NextResponse.json({ user }, { status: 200 });

  } catch (error) {
    console.error("Erreur dans /api/users/current:", error);
    
    // Gestion spécifique des erreurs JWT
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    return NextResponse.json(
      {
        error: "Une erreur est survenue lors de la récupération de l'utilisateur",
        message: process.env.NODE_ENV === 'development' ? error : 'Erreur interne'
      },
      { status: 500 }
    );
  }
}