import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/currentUser';

// GET /api/admin/management/stations
export async function GET(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.error || !user.user || user.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Accès non autorisé', success: false }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const city = searchParams.get('city') || '';

    const where: any = {};
    if (search) {
      where.OR = [
        { denomination: { contains: search, mode: 'insensitive' } },
        { city: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (city) {
      where.city = { contains: city, mode: 'insensitive' };
    }

    const stations = await prisma.gare.findMany({
      where,
      orderBy: { denomination: 'asc' },
    });
    return NextResponse.json({ success: true, stations });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors de la récupération des gares', success: false }, { status: 500 });
  }
}

// POST /api/admin/management/stations
export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.error || !user.user || user.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Accès non autorisé', success: false }, { status: 401 });
    }
    const body = await request.json();
    const { denomination, city, phoneNumber, horaireOuverture, horaireFermeture } = body;
    if (!denomination || !city || !phoneNumber || !horaireOuverture || !horaireFermeture) {
      return NextResponse.json({ error: 'Tous les champs sont requis', success: false }, { status: 400 });
    }
    const station = await prisma.gare.create({
      data: {
        denomination,
        city,
        phoneNumber,
        horaireOuverture,
        horaireFermeture,
      },
    });
    return NextResponse.json({ success: true, station });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors de la création de la gare', success: false }, { status: 500 });
  }
} 