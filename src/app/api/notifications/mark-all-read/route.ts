import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/currentUser';
import { NotificationStatus } from '../../../../../generated/prisma';
import { Role } from '../../../../../generated/prisma';

export async function POST() {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    let whereClause: any = {
      status: NotificationStatus.UNREAD,
    };

    if (currentUser.user?.role === Role.ADMIN) {
      whereClause.OR = [
        { targetUserId: null },
        { targetUserId: currentUser.user?.id }
      ];
    } else {
      whereClause.targetUserId = currentUser.user?.id;
    }

    await prisma.notification.updateMany({
      where: whereClause,
      data: {
        status: NotificationStatus.READ,
      },
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Toutes les notifications marquées comme lues'
    });
  } catch (error) {
    console.error('Erreur lors du marquage de toutes les notifications:', error);
    return NextResponse.json(
      { error: 'Erreur lors du marquage de toutes les notifications' },
      { status: 500 }
    );
  }
} 