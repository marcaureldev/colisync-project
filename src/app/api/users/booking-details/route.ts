// import { prisma } from "@/lib/db";
// import { NextResponse } from "next/server";
// import { getCurrentUser } from "@/lib/currentUser";

// export async function POST(request: Request) {
//   try {
//     const { user, error, status } = await getCurrentUser();
//     if (error) {
//       return NextResponse.json({ error }, { status });
//     }

//     if (!user) {
//       return NextResponse.json(
//         { error: "Utilisateur non authentifié" },
//         { status: 401 }
//       );
//     }

//     const body = await request.json();
//     const { id } = body;

//     if (!id) {
//       return NextResponse.json(
//         { error: "ID de réservation requis" },
//         { status: 400 }
//       );
//     }

//     // Permet de vérifier si l'ID est au format MongoDB ObjectId valide
//     if (!/^[0-9a-fA-F]{24}$/.test(id)) {
//       return NextResponse.json(
//         { error: "Format d'ID de réservation invalide" },
//         { status: 400 }
//       );
//     }

//     const reservationDetails = await prisma.reservation.findUnique({
//       where: {
//         id: id,
//       },
//       include: {
//         packages: true,
//       },
//     });

//     if (!reservationDetails) {
//       return NextResponse.json(
//         { error: "Réservation non trouvée" },
//         { status: 404 }
//       );
//     }

//     // Vérifier si la réservation appartient à l'utilisateur connecté
//     if (reservationDetails.userId !== user.id) {
//       return NextResponse.json(
//         { error: "Accès non autorisé à cette réservation" },
//         { status: 403 }
//       );
//     }

//     return NextResponse.json({ data: reservationDetails }, { status: 200 });
//   } catch (error) {
//     console.error("Erreur API:", error);

//     if (error instanceof SyntaxError) {
//       return NextResponse.json(
//         { error: "Format JSON invalide" },
//         { status: 400 }
//       );
//     }

//     return NextResponse.json(
//       { error: "Erreur interne du serveur" },
//       { status: 500 }
//     );
//   }
// }

import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/currentUser"

export async function POST(request: Request) {
  try {
    const { user, error, status } = await getCurrentUser()
    if (error) {
      return NextResponse.json({ error }, { status })
    }

    if (!user) {
      return NextResponse.json({ error: "Utilisateur non authentifié" }, { status: 401 })
    }

    const body = await request.json()
    const { id } = body

    if (!id) {
      return NextResponse.json({ error: "ID de réservation requis" }, { status: 400 })
    }

    // Amélioration: Validation plus robuste de l'ObjectId
    if (typeof id !== "string" || !/^[0-9a-fA-F]{24}$/.test(id)) {
      return NextResponse.json({ error: "Format d'ID de réservation invalide" }, { status: 400 })
    }

    // Amélioration: Gestion d'erreur Prisma plus spécifique
    let reservationDetails
    try {
      reservationDetails = await prisma.reservation.findUnique({
        where: {
          id: id,
        },
        include: {
          packages: {
            orderBy: {
              createdAt: "asc",
            },
          },
        },
      })
    } catch (prismaError) {
      console.error("Erreur Prisma:", prismaError)
      return NextResponse.json({ error: "Erreur lors de la récupération des données" }, { status: 500 })
    }

    if (!reservationDetails) {
      return NextResponse.json({ error: "Réservation non trouvée" }, { status: 404 })
    }

    // Vérifier si la réservation appartient à l'utilisateur connecté
    if (reservationDetails.userId !== user.id) {
      return NextResponse.json({ error: "Accès non autorisé à cette réservation" }, { status: 403 })
    }

    return NextResponse.json(
      {
        data: reservationDetails,
        success: true,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Erreur API:", error)
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: "Format JSON invalide dans la requête" }, { status: 400 })
    }

    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}
