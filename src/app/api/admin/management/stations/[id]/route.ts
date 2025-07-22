import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/currentUser';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser();
    if (!user || user.error || !user.user || user.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Accès non autorisé', success: false }, { status: 401 });
    }
    const id = params.id;
    const body = await request.json();
    const { denomination, city, phoneNumber, horaireOuverture, horaireFermeture } = body;
    if (!denomination || !city || !phoneNumber || !horaireOuverture || !horaireFermeture) {
      return NextResponse.json({ error: 'Tous les champs sont requis', success: false }, { status: 400 });
    }
    const updated = await prisma.gare.update({
      where: { id },
      data: {
        denomination,
        city,
        phoneNumber,
        horaireOuverture,
        horaireFermeture,
      },
    });
    return NextResponse.json({ success: true, station: updated });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors de la modification de la gare', success: false }, { status: 500 });
  }
} 