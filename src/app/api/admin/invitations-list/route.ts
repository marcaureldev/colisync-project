import { getCurrentUser } from "@/lib/currentUser";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser();

    if (user.error || user.user?.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Accès non autorisé", success: false },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const searchTerm = searchParams.get("search") || "";
    const filterType = searchParams.get("type") || "all";
    const filterStatus = searchParams.get("status") || "all";
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "10");

    // Construire les conditions de filtrage
    const where: any = {
      createdBy: user.user.id,
    };

    if (searchTerm) {
      where.code = { contains: searchTerm, mode: "insensitive" };
    }

    if (filterType !== "all") {
      where.role = filterType === "company" ? "COMPANY" : "AGENT_GARE";
    }

    if (filterStatus !== "all") {
      if (filterStatus === "pending") {
        where.AND = [
          { isUsed: false },
          { expiresAt: { gt: new Date() } },
        ];
      } else if (filterStatus === "used") {
        where.isUsed = true;
      } else if (filterStatus === "expired") {
        where.AND = [
          { isUsed: false },
          { expiresAt: { lte: new Date() } },
        ];
      }
    }

    // Récupérer les invitations
    const [invitations, totalCount] = await Promise.all([
      prisma.invitationCode.findMany({
        where,
        include: {
          gare: true, // Inclure les infos de la gare si disponible
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: "desc" },
      }),
      prisma.invitationCode.count({ where }),
    ]);

    const formattedInvitations = invitations.map((inv) => ({
      id: inv.id,
      code: inv.code,
      type: inv.role === "COMPANY" ? "company" : "agent",
      name: inv.name,
      email: "",
      station: inv.name,
      createdAt: inv.createdAt.toLocaleDateString("fr-FR"),
      status: inv.isUsed
        ? "used"
        : inv.expiresAt < new Date()
        ? "expired"
        : "pending",
    }));

    return NextResponse.json({
      success: true,
      invitations: formattedInvitations,
      totalCount,
      page,
      pageSize,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des invitations", success: false },
      { status: 500 }
    );
  }
}