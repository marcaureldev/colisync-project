import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { NotificationStatus, NotificationType } from '../../../../../../generated/prisma';


export async function POST(request: NextRequest) {
  try {
    const { type, title, message, targetUserId } = await request.json();

    // Créer la notification dans la base de données
    const notification = await prisma.notification.create({
      data: {
        type: type as NotificationType,
        title,
        message,
        status: NotificationStatus.UNREAD,
        targetUserId: targetUserId || null,
      },
    });

    return NextResponse.json({ 
      success: true, 
      notification,
      message: 'Notification générée avec succès'
    });

  } catch (error) {
    console.error('Erreur lors de la génération de notification:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la génération de notification' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Récupérer les notifications non lues de la base de données
    const notifications = await prisma.notification.findMany({
      where: {
        status: NotificationStatus.UNREAD,
      },
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