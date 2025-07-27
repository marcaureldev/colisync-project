import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/currentUser';
import { Role } from '../../../../../generated/prisma';


export async function GET() {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        { error: 'Utilisateur non authentifié' },
        { status: 401 }
      );
    }

    let whereClause: any = {};

    if (currentUser.user?.role === Role.ADMIN) {
      // Les admins voient les notifications système (sans targetUserId) et les leurs
      whereClause = {
        OR: [
          { targetUserId: null },
          { targetUserId: currentUser.user?.id }
        ]
      };
    } else {
      // Les autres utilisateurs ne voient que les leurs
      whereClause = {
        targetUserId: currentUser.user?.id
      };
    }

    const notifications = await prisma.notification.findMany({
      where: whereClause,
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    return NextResponse.json({ 
      success: true, 
      notifications,
      message: 'Notifications récupérées avec succès'
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des notifications:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des notifications' },
      { status: 500 }
    );
  }
} 