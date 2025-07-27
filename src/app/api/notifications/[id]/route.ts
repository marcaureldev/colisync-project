import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/currentUser';
import { NotificationStatus } from '../../../../../generated/prisma/client';

async function checkNotificationOwnership(notificationId: string, userId: string) {
  const notification = await prisma.notification.findUnique({
    where: { id: notificationId },
  });

  if (!notification) {
    return { error: 'Notification non trouvée', status: 404 };
  }

  // Les notifications système (targetUserId: null) peuvent être modifiées par les admins,
  // mais la logique actuelle ne le permet que pour le destinataire.
  // Pour la suppression/lecture, on s'assure que l'utilisateur est le destinataire.
  if (notification.targetUserId !== userId) {
    return { error: 'Accès non autorisé', status: 403 };
  }

  return { notification };
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || !currentUser.user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const { error, status } = await checkNotificationOwnership(params.id, currentUser.user.id);
    if (error) {
      return NextResponse.json({ error }, { status });
    }

    const updatedNotification = await prisma.notification.update({
      where: { id: params.id },
      data: { status: NotificationStatus.READ },
    });

    return NextResponse.json({ 
      success: true, 
      notification: updatedNotification,
      message: 'Notification marquée comme lue'
    });
  } catch (error) {
    console.error('Erreur lors du marquage de la notification:', error);
    return NextResponse.json(
      { error: 'Erreur lors du marquage de la notification' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || !currentUser.user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const { error, status } = await checkNotificationOwnership(params.id, currentUser.user.id);
    if (error) {
      return NextResponse.json({ error }, { status });
    }

    await prisma.notification.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Notification supprimée avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de la notification:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de la notification' },
      { status: 500 }
    );
  }
} 