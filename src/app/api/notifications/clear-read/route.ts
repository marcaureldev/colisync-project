import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/currentUser';
import { NotificationStatus } from '../../../../../generated/prisma';
import { Role } from '../../../../../generated/prisma';

export async function DELETE() {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    let whereClause: any = {
      status: NotificationStatus.READ,
    };

    if (currentUser.user?.role === Role.ADMIN) {
      whereClause.OR = [
        { targetUserId: null },
        { targetUserId: currentUser.user?.id }
      ];
    } else {
      whereClause.targetUserId = currentUser.user?.id;
    }

    await prisma.notification.deleteMany({
      where: whereClause,
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Toutes les notifications lues supprimées'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression des notifications lues:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression des notifications lues' },
      { status: 500 }
    );
  }
} 