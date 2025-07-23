import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/currentUser';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    
    if (!currentUser || !currentUser.user || currentUser.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
    }

    // Récupérer toutes les notifications non lues pour les admins
    const notifications = await prisma.notification.findMany({
      where: {
        OR: [
          { targetUserId: currentUser.user.id },
          { targetUserId: null } // Notifications globales pour tous les admins
        ],
        status: 'UNREAD'
      },
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        targetUser: {
          select: {
            id: true,
            displayName: true,
            email: true,
            role: true
          }
        }
      }
    });

    return NextResponse.json({ notifications });
  } catch (error) {
    console.error('Erreur lors de la récupération des notifications:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    
    if (!currentUser || !currentUser.user || currentUser.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
    }

    const { notificationId } = await request.json();

    if (!notificationId) {
      return NextResponse.json({ error: 'ID de notification requis' }, { status: 400 });
    }

    // Marquer la notification comme lue
    const updatedNotification = await prisma.notification.update({
      where: { id: notificationId },
      data: { status: 'READ' }
    });

    return NextResponse.json({ notification: updatedNotification });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la notification:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
} 