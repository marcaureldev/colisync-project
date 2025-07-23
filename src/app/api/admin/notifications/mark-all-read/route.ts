import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/currentUser';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();

    if (
      !currentUser ||
      !currentUser.user ||
      currentUser.user.role !== 'ADMIN'
    ) {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
    }


    // Marquer toutes les notifications non lues comme lues
    await prisma.notification.updateMany({
      where: {
        OR: [
          { targetUserId: currentUser.user.id },
          { targetUserId: null } // Notifications globales pour tous les admins
        ],
        status: 'UNREAD'
      },
      data: {
        status: 'READ'
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur lors du marquage des notifications:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
} 